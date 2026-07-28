export type PortalArtwork = {
  id: string;
  title: string;
  tamilTitle: string;
  description: string;
  assetPath: string | null;
  fallbackPath: string;
  sourceReference: string;
  readyForProduction: boolean;
  alt: string;
};

/**
 * The owner-selected ChatGPT share URL is recorded here, but the page cannot be used as a
 * production image source. Once the original JPG, PNG, or WebP is uploaded, set assetPath and
 * readyForProduction=true. The UI remains hidden until then, preventing a broken or misleading image.
 */
export const ownerSelectedArtwork: PortalArtwork = {
  id: "owner-selected-divyanexus-vision",
  title: "A divine knowledge horizon",
  tamilTitle: "தெய்வீக ஞானத்தின் ஒளிக்காட்சி",
  description: "A project-owner-selected visual prepared for a dedicated premium homepage feature once the original image file is available.",
  assetPath: null,
  fallbackPath: "/assets/divyanexus/hero-moonlit-horizon.webp",
  sourceReference: "https://chatgpt.com/s/m_6a68a8d1088481919dcffce0963b43db",
  readyForProduction: false,
  alt: "Owner-selected DivyaNexus visual",
};
