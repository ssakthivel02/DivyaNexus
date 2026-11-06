import type { DeitySourceReference } from "./types";

export const deitySources: Record<string, DeitySourceReference> = {
  "met-recognising-gods": {
    id: "met-recognising-gods",
    title: "Recognizing the Gods",
    organisation: "The Metropolitan Museum of Art",
    url: "https://www.metmuseum.org/toah/hd/gods/hd_gods.htm",
    category: "Museum reference",
    note: "A museum overview of recurring iconographic attributes, vehicles, relationships, and forms in Hindu art.",
  },
  "met-ganesha": {
    id: "met-ganesha",
    title: "Ganesha — Tamil Nadu, Chola period",
    organisation: "The Metropolitan Museum of Art",
    url: "https://www.metmuseum.org/art/collection/search/37397",
    category: "Museum reference",
    note: "Object record supporting the elephant-headed form and relationship to Shiva and Parvati.",
  },
  "met-saraswati": {
    id: "met-saraswati",
    title: "Saraswati, Goddess of Learning and Music",
    organisation: "The Metropolitan Museum of Art",
    url: "https://www.metmuseum.org/art/collection/search/74840",
    category: "Museum reference",
    note: "Object record describing the vina, book, rosary, lotus, and learning-and-music context.",
  },
  "met-kumara": {
    id: "met-kumara",
    title: "Kumara Riding a Peacock",
    organisation: "The Metropolitan Museum of Art",
    url: "https://www.metmuseum.org/art/collection/search/38333",
    category: "Museum reference",
    note: "Object record connecting Kumara, Skanda, Karttikeya, Shiva, Parvati, and the peacock vehicle.",
  },
  "british-museum-shiva": {
    id: "british-museum-shiva",
    title: "Śiva (Shiva) collection biography",
    organisation: "The British Museum",
    url: "https://www.britishmuseum.org/collection/term/BIOG16395",
    category: "Museum reference",
    note: "Collection biography covering iconic and aniconic forms, Nataraja, meditation, Nandi, and family relationships.",
  },
  "british-museum-murugan": {
    id: "british-museum-murugan",
    title: "Kārttikeya (Skanda) collection biography",
    organisation: "The British Museum",
    url: "https://www.britishmuseum.org/collection/term/BIOG11335",
    category: "Museum reference",
    note: "Collection biography documenting names including Skanda, Karttikeya, Subrahmanya, Shanmukha, Kumara, and Murugan.",
  },
  "british-museum-nataraja": {
    id: "british-museum-nataraja",
    title: "Śiva Natarāja object record",
    organisation: "The British Museum",
    url: "https://www.britishmuseum.org/collection/object/A_1987-0314-1",
    category: "Museum reference",
    note: "Object record for the dancing Shiva form, including the anandatandava pose and Apasmara.",
  },
  "smarthistory-hindu-deities": {
    id: "smarthistory-hindu-deities",
    title: "Hindu deities",
    organisation: "Smarthistory",
    url: "https://smarthistory.org/hindu-deities/",
    category: "Scholarly overview",
    note: "An introductory scholarly overview that stresses diversity among Shaiva, Vaishnava, and Goddess traditions.",
  },
  "smarthistory-nataraja": {
    id: "smarthistory-nataraja",
    title: "Shiva as Lord of the Dance (Nataraja)",
    organisation: "Smarthistory",
    url: "https://smarthistory.org/shiva-as-lord-of-the-dance-nataraja/",
    category: "Scholarly overview",
    note: "A focused art-historical introduction to the Nataraja image and its Chola-period visual context.",
  },
  "gita-supersite": {
    id: "gita-supersite",
    title: "Bhagavad Gita source and commentary portal",
    organisation: "IIT Kanpur",
    url: "https://www.gitasupersite.iitk.ac.in/",
    category: "Primary-text pathway",
    note: "A primary-text and commentary portal for edition-specific study of Krishna in the Bhagavad Gita.",
  },
};

export function resolveDeitySources(ids: readonly string[]): DeitySourceReference[] {
  return ids
    .map((id) => deitySources[id])
    .filter((source): source is DeitySourceReference => Boolean(source));
}
