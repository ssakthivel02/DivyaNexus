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
 * The project owner supplied the production WebP after selecting the visual through the recorded
 * ChatGPT share reference. The share page is retained only as editorial provenance; the portal
 * always renders the repository-owned image asset and never hotlinks the share page.
 */
export const ownerSelectedArtwork: PortalArtwork = {
  id: "owner-selected-divyanexus-vision",
  title: "A portal vision for timeless guidance",
  tamilTitle: "காலத்தைத் தாண்டும் ஞானத்திற்கான திவ்யநெக்சஸ் காட்சி",
  description:
    "The project-owner-selected DivyaNexus vision brings scriptures, deity traditions, temples, rishis, festivals, learning and family pathways into one calm knowledge horizon.",
  assetPath: "/assets/divyanexus/owner-selected-vision.webp",
  fallbackPath: "/assets/divyanexus/hero-moonlit-horizon.webp",
  sourceReference: "https://chatgpt.com/s/m_6a68a8d1088481919dcffce0963b43db",
  readyForProduction: true,
  alt: "DivyaNexus portal vision showing a moonlit Shiva knowledge homepage with scripture, deity, temple, rishi, festival and learning pathways.",
};
