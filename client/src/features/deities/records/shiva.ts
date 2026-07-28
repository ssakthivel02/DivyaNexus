import type { DeityRecord } from "../types";

export const shiva: DeityRecord = {
  slug: "shiva",
  name: "Shiva",
  tamilName: "சிவன்",
  transliterations: ["Siva", "Śiva", "Shivan", "Sivan"],
  strapline: "Ascetic, householder, teacher, dancer, and a central focus of Shaiva traditions.",
  tamilStrapline: "துறவி, இல்லறத் தலைவர், குரு, நடனமூர்த்தி—சைவ மரபுகளின் மையத் தெய்வம்.",
  summary:
    "Shiva is approached through many names and forms across regions and traditions. This orientation keeps meditation, family imagery, the linga, Nataraja, and devotional theology distinct rather than presenting one image as the whole tradition.",
  tamilSummary:
    "சிவன் பல பெயர்கள், வடிவங்கள், வட்டார மரபுகள் வழியாக அறியப்படுகிறார். தியானம், குடும்ப உருவகம், லிங்கம், நடராஜர், பக்தித் தத்துவம் ஆகியவற்றை ஒன்றாகக் கலக்காமல் தனித்தனி ஆய்வுப் பாதைகளாக இப்பதிவு காட்டுகிறது.",
  traditions: ["Shaiva traditions", "Temple worship", "Yoga and ascetic imagery", "Tamil devotional literature"],
  forms: ["Linga", "Nataraja", "Dakshinamurti", "Ardhanarishvara", "Somaskanda"],
  iconography: [
    { label: "Common attributes", value: "Trident, crescent moon, matted hair, third eye, serpent, and drum appear in different forms." },
    { label: "Vehicle", value: "Nandi, the bull", tamilValue: "நந்தி" },
    { label: "Important caution", value: "Attributes vary by region, period, text, and specific iconographic form." },
  ],
  relationships: [
    { label: "Consort", value: "Parvati" },
    { label: "Family traditions", value: "Ganesha and Karttikeya/Murugan are commonly presented as children of Shiva and Parvati." },
  ],
  associatedTexts: ["Shaiva Agamas", "Shiva Purana traditions", "Tevaram devotional corpus", "Selected Vedic Rudra passages"],
  observanceContext: ["Maha Shivaratri", "Pradosha traditions", "Regional temple festivals"],
  studyQuestions: ["How do linga and iconic forms function differently?", "How does Tamil bhakti literature approach Shiva?", "How does Nataraja communicate through movement and symbol?"],
  relatedSlugs: ["parvati", "ganesha", "murugan", "nataraja"],
  sourceIds: ["british-museum-shiva", "met-recognising-gods", "smarthistory-hindu-deities"],
  confidence: "HIGH",
  editorialStatus: "Reviewed orientation",
  reviewedDate: "28 July 2026",
};
