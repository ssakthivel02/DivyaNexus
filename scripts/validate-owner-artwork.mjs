import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const assetRelativePath = "client/public/assets/divyanexus/owner-selected-vision.webp";
const assetPath = resolve(root, assetRelativePath);
const configPath = resolve(root, "client/src/data/portalArtwork.ts");
const componentPath = resolve(root, "client/src/components/PortalArtworkPanel.tsx");
const homePath = resolve(root, "client/src/pages/Home.tsx");
const cssPath = resolve(root, "client/src/owner-artwork-wave7.css");
const serviceWorkerPath = resolve(root, "client/public/sw.js");
const failures = [];

if (!existsSync(assetPath)) failures.push(`Missing ${assetRelativePath}`);

function webpDimensions(buffer) {
  if (buffer.length < 30 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") {
    throw new Error("Asset is not a RIFF WebP file");
  }

  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const type = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;

    if (type === "VP8X" && data + 10 <= buffer.length) {
      return { width: 1 + buffer.readUIntLE(data + 4, 3), height: 1 + buffer.readUIntLE(data + 7, 3) };
    }

    if (type === "VP8L" && data + 5 <= buffer.length && buffer[data] === 0x2f) {
      const bits = buffer.readUInt32LE(data + 1);
      return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >>> 14) & 0x3fff) };
    }

    if (type === "VP8 " && data + 10 <= buffer.length) {
      if (buffer[data + 3] !== 0x9d || buffer[data + 4] !== 0x01 || buffer[data + 5] !== 0x2a) {
        throw new Error("VP8 frame header is malformed");
      }
      return { width: buffer.readUInt16LE(data + 6) & 0x3fff, height: buffer.readUInt16LE(data + 8) & 0x3fff };
    }

    offset = data + size + (size % 2);
  }

  throw new Error("WebP dimensions could not be determined");
}

let dimensions = null;
let bytes = 0;
if (existsSync(assetPath)) {
  const asset = readFileSync(assetPath);
  bytes = statSync(assetPath).size;
  try {
    dimensions = webpDimensions(asset);
  } catch (error) {
    failures.push(error instanceof Error ? error.message : String(error));
  }

  if (bytes < 100_000) failures.push(`Artwork is unexpectedly small (${bytes} bytes)`);
  if (bytes > 900_000) failures.push(`Artwork exceeds the 900 KB production budget (${bytes} bytes)`);
}

if (dimensions) {
  const ratio = dimensions.width / dimensions.height;
  if (dimensions.width < 1200 || dimensions.height < 675) failures.push(`Artwork resolution is below 1200×675 (${dimensions.width}×${dimensions.height})`);
  if (ratio < 1.5 || ratio > 2) failures.push(`Artwork aspect ratio is outside the supported landscape range (${ratio.toFixed(3)})`);
}

const config = readFileSync(configPath, "utf8");
if (!config.includes('assetPath: "/assets/divyanexus/owner-selected-vision.webp"')) failures.push("Portal artwork config does not use the repository-owned asset");
if (!config.includes("readyForProduction: true")) failures.push("Portal artwork is not activated for production");
if (!config.includes('sourceReference: "https://chatgpt.com/s/')) failures.push("Owner selection provenance is not recorded");

const component = readFileSync(componentPath, "utf8");
if (!component.includes('id="owner-portal-vision"')) failures.push("Owner artwork lacks a stable homepage anchor");
if (!component.includes('data-owner-artwork="active"')) failures.push("Homepage component lacks an explicit active artwork marker");
if (!component.includes('loading="eager"') || !component.includes('fetchPriority="high"')) failures.push("Owner artwork is not prioritised for immediate visibility");
if (!component.includes("ownerSelectedArtwork.fallbackPath")) failures.push("Owner artwork lacks a safe local fallback");
if (component.includes("sourceReference}")) failures.push("The ChatGPT share reference must not be rendered as an image source");

const home = readFileSync(homePath, "utf8");
if (!home.includes("<PortalArtworkPanel />")) failures.push("Homepage does not render the owner artwork panel");
if (!home.includes('href="#owner-portal-vision"')) failures.push("Homepage hero does not provide a direct artwork jump link");

const css = readFileSync(cssPath, "utf8");
if (!css.includes("object-fit: contain")) failures.push("Owner artwork must be displayed without cropping");
if (!css.includes("prefers-reduced-motion")) failures.push("Owner artwork styles lack reduced-motion handling");
if (!css.includes("focus-visible")) failures.push("Owner artwork actions lack a visible keyboard-focus contract");

const serviceWorker = readFileSync(serviceWorkerPath, "utf8");
if (!serviceWorker.includes("owner-selected-vision.webp")) failures.push("Owner artwork is not included in the offline shell");
if (!serviceWorker.includes("divyanexus-stage-b-wave8-v1")) failures.push("Service-worker cache was not versioned for Wave 8");

if (failures.length) {
  console.error("Owner-artwork validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log(`Owner-artwork validation passed: ${dimensions.width}×${dimensions.height}, ${bytes} bytes, visible on the homepage, uncropped and offline-ready.`);
