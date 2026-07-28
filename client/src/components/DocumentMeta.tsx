import { useEffect } from "react";
import { useLocation } from "wouter";
import { DIVYANEXUS_RELEASE } from "@/config/release";
import { canonicalForLocation, resolveRouteMeta } from "@/config/routeMeta";

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = href;
}

function setStructuredData(location: string, title: string, description: string, image: string, schemaType: string) {
  const id = "divyanexus-route-structured-data";
  let script = document.head.querySelector<HTMLScriptElement>(`#${id}`);
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  const canonical = canonicalForLocation(location);
  const data = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: title,
    description,
    url: canonical,
    image,
    isPartOf: {
      "@type": "WebSite",
      name: "DivyaNexus",
      url: `${DIVYANEXUS_RELEASE.domain}/`,
      inLanguage: ["en", "ta"],
    },
    publisher: {
      "@type": "Organization",
      name: "DivyaNexus",
      url: `${DIVYANEXUS_RELEASE.domain}/`,
    },
  };

  script.textContent = JSON.stringify(data);
}

export function DocumentMeta() {
  const [location] = useLocation();

  useEffect(() => {
    const meta = resolveRouteMeta(location);
    const canonical = canonicalForLocation(location);
    const image = meta.image ?? `${DIVYANEXUS_RELEASE.domain}/assets/divyanexus/hero-moonlit-horizon.webp`;

    document.title = meta.title;
    document.documentElement.lang = "en";
    setMeta("name", "description", meta.description);
    setMeta("name", "robots", meta.robots ?? "index,follow");
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "DivyaNexus");
    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:image", image);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", meta.title);
    setMeta("name", "twitter:description", meta.description);
    setMeta("name", "twitter:image", image);
    setCanonical(canonical);
    setStructuredData(location, meta.title, meta.description, image, meta.schemaType);
  }, [location]);

  return null;
}
