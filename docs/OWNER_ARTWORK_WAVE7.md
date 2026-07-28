# DivyaNexus Owner Artwork Wave 7

Date: 28 July 2026

## Owner-selected asset

The project owner supplied the repository-owned production file:

```text
client/public/assets/divyanexus/owner-selected-vision.webp
```

The original selection reference remains recorded in `client/src/data/portalArtwork.ts` for editorial provenance. The application does not hotlink or render the ChatGPT share page.

## Homepage treatment

The image is presented as a dedicated homepage portal-vision showcase below the live collection coverage section.

The integration:

- renders the full WebP without cropping;
- provides a descriptive alternative text;
- includes Tamil and English context;
- exposes a direct link to the full visual;
- links users back into the live `/explore` portal;
- distinguishes the owner-approved vision from live collection totals;
- lazy-loads the below-the-fold image;
- provides a repository-owned fallback;
- supports dawn and night themes;
- supports reduced-motion preferences;
- preserves visible keyboard focus;
- remains responsive at 320, 390, 768 and 1440 pixels.

## Production controls

`scripts/validate-owner-artwork.mjs` verifies:

- RIFF/WebP signature;
- intrinsic dimensions;
- landscape aspect ratio;
- minimum useful resolution;
- 900 KB maximum asset budget;
- repository-owned asset configuration;
- production activation flag;
- safe local fallback;
- uncropped CSS treatment;
- reduced-motion and focus-visible support;
- service-worker cache inclusion.

The deployment artifact must contain:

```text
assets/divyanexus/owner-selected-vision.webp
```

Production smoke verifies HTTP 200, `image/webp`, file-size bounds and the RIFF/WebP signature.

## Browser coverage

Playwright verifies:

- homepage visibility;
- correct asset path;
- successful image decoding;
- minimum intrinsic dimensions;
- `object-fit: contain`;
- bilingual context;
- working actions;
- responsive overflow;
- safe fallback behaviour.

## Truth boundary

The supplied image represents the project owner's selected portal vision. It does not by itself prove that every number, pathway or feature depicted inside the image is currently available. The live portal and `/collection-status` remain authoritative for present functionality and editorial coverage.
