/**
 * DivyaNexus mantra candidate set — 2026-11-16.
 * This is editorial staging data, NOT blanket approval of canonical status.
 * Tamil is an approximate reading aid; Sanskrit originals and regional usages differ.
 * Source links are leads. A human text-and-lineage review is still required before public release.
 */
export type MantraEvidenceStatus = "linked-reference" | "editorial-review-needed";
export type MantraRecord = {
  id: string;
  tradition: string;
  title: string;
  tamil: string;
  devanagari: string;
  iast: string;
  englishMeaning: string;
  tamilMeaning: string;
  sourceLabel: string;
  sourceUrl: string;
  evidenceStatus: MantraEvidenceStatus;
};
export const mantraRecords: readonly MantraRecord[] = [
  {
    "id": "murugan-saravanabhava",
    "tradition": "Murugan",
    "title": "Om Saravanabhava",
    "tamil": "ஓம் சரவணபவ",
    "devanagari": "ॐ सरवणभव",
    "iast": "oṃ saravaṇabhava",
    "englishMeaning": "An invocation of Murugan by his Saravana name.",
    "tamilMeaning": "சரவணபவ திருநாமத்தால் முருகனை வணங்குதல்.",
    "sourceLabel": "Shri Subrahmanya Shadakshara Mantra — independent textual witness for Om Sharavanabhava/Saravanabhava",
    "sourceUrl": "https://sanskritdocuments.org/doc_subrahmanya/subrahmaNyaShaDakSharamantraH2.html",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "murugan-vel",
    "tradition": "Murugan",
    "title": "Vel Vel Muruga",
    "tamil": "வேல் வேல் முருகா, வெற்றி வேல் முருகா",
    "devanagari": "",
    "iast": "vēl vēl murugā, veṭṟi vēl murugā",
    "englishMeaning": "A Tamil devotional invocation celebrating Murugan and his vel.",
    "tamilMeaning": "முருகனையும் அவரது வேலையும் போற்றும் தமிழ் பக்தி முழக்கம்.",
    "sourceLabel": "Murugan Mantra Collection",
    "sourceUrl": "https://omsaravanabhava.org/murugan-mantras.html",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "murugan-skanda-sharanam",
    "tradition": "Murugan",
    "title": "Skanda Sharanam",
    "tamil": "ஸ்கந்தா சரணம், சரவணபவ குகா சரணம்",
    "devanagari": "",
    "iast": "skandā śaraṇam, saravaṇabhava guhā śaraṇam",
    "englishMeaning": "A devotional invocation of refuge in Skanda, Saravanabhava and Guha.",
    "tamilMeaning": "ஸ்கந்தன், சரவணபவன், குகன் எனும் திருநாமங்களைப் போற்றிச் சரணடையும் பக்தி முழக்கம்.",
    "sourceLabel": "OmSaravanaBhava — Murugan Mantra Collection (devotional usage; editorial review pending)",
    "sourceUrl": "https://omsaravanabhava.org/murugan-mantras.html",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "murugan-shanmuga-sharanam",
    "tradition": "Murugan",
    "title": "Shanmuga Sharanam",
    "tamil": "ஷண்முகா சரணம் சரணம், ஸ்கந்த குரோ சரணம்",
    "devanagari": "",
    "iast": "ṣaṇmukhā śaraṇam śaraṇam, skanda guro śaraṇam",
    "englishMeaning": "A devotional invocation of refuge in Shanmuga and Skanda as teacher.",
    "tamilMeaning": "ஷண்முகனையும் குருவாகிய ஸ்கந்தனையும் சரணடையும் பக்தி முழக்கம்.",
    "sourceLabel": "OmSaravanaBhava — Murugan Mantra Collection (devotional usage; editorial review pending)",
    "sourceUrl": "https://omsaravanabhava.org/murugan-mantras.html",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "murugan-sharanam",
    "tradition": "Murugan",
    "title": "Muruga Sharanam",
    "tamil": "முருகா சரணம், கந்தா சரணம்",
    "devanagari": "",
    "iast": "murugā śaraṇam, kandā śaraṇam",
    "englishMeaning": "A Tamil devotional invocation of refuge in Murugan.",
    "tamilMeaning": "முருகனையும் கந்தனையும் போற்றிச் சரணடையும் தமிழ் பக்தி முழக்கம்.",
    "sourceLabel": "OmSaravanaBhava — Murugan Mantra Collection (devotional usage; editorial review pending)",
    "sourceUrl": "https://omsaravanabhava.org/murugan-mantras.html",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "shiva-panchakshara",
    "tradition": "Shiva",
    "title": "Om Namah Shivaya",
    "tamil": "ஓம் நமசிவாய",
    "devanagari": "ॐ नमः शिवाय",
    "iast": "oṃ namaḥ śivāya",
    "englishMeaning": "Salutations to Shiva; commonly called the five-syllable mantra (excluding Om).",
    "tamilMeaning": "சிவபெருமானுக்கு வணக்கம் செலுத்தும் பஞ்சாட்சரத் திருநாமம்.",
    "sourceLabel": "Shiva Shadakshara Stotram — explicit Om Namah Shivaya witness",
    "sourceUrl": "https://sanskritdocuments.org/doc_shiva/shivaShaDakSharastotram3.pdf",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "ganesha-ganapataye",
    "tradition": "Ganesha",
    "title": "Om Gam Ganapataye Namah",
    "tamil": "ஓம் கம் கணபதயே நம:",
    "devanagari": "ॐ गं गणपतये नमः",
    "iast": "oṃ gaṃ gaṇapataye namaḥ",
    "englishMeaning": "A salutation to Ganapati using his traditional seed syllable.",
    "tamilMeaning": "கணபதியை அவரது பீஜ எழுத்துடன் வணங்கும் மந்திரம்.",
    "sourceLabel": "Ganapati Atharvashirsha",
    "sourceUrl": "https://www.arshavidya.org.uk/a/pdfs/GanapatiAtharvashirshaUpanishad.pdf",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "vishnu-ashtakshara",
    "tradition": "Vishnu",
    "title": "Om Namo Narayanaya",
    "tamil": "ஓம் நமோ நாராயணாய",
    "devanagari": "ॐ नमो नारायणाय",
    "iast": "oṃ namo nārāyaṇāya",
    "englishMeaning": "Salutations to Narayana; the eight-syllable invocation in the Narayana Upanishad.",
    "tamilMeaning": "நாராயணனுக்கு வணக்கம் செலுத்தும் அஷ்டாட்சர மந்திரம்.",
    "sourceLabel": "Narayana Upanishad",
    "sourceUrl": "https://ignca.gov.in/Asi_data/16305.pdf",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "rama-jayam",
    "tradition": "Rama",
    "title": "Sri Rama Jayam",
    "tamil": "ஸ்ரீ ராம ஜெயம்",
    "devanagari": "श्री राम जयम्",
    "iast": "śrī rāma jayam",
    "englishMeaning": "A widely used Tamil name-recitation honoring Rama; not presented as a Vedic verse.",
    "tamilMeaning": "ராம நாமத்தைப் போற்றும் பரவலான தமிழ் நாமஜபம்.",
    "sourceLabel": "Covaipost — 2016 report on Rama Nama Japa (documented devotional usage, not a canonical verse)",
    "sourceUrl": "https://www.covaipost.com/coimbatore360/on-a-mission-to-complete-100-crore-rama-nama-japa/",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "krishna-mahamantra",
    "tradition": "Krishna",
    "title": "Hare Krishna Maha-mantra",
    "tamil": "ஹரே கிருஷ்ண ஹரே கிருஷ்ண கிருஷ்ண கிருஷ்ண ஹரே ஹரே । ஹரே ராம ஹரே ராம ராம ராம ஹரே ஹரே ॥",
    "devanagari": "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥",
    "iast": "hare kṛṣṇa hare kṛṣṇa kṛṣṇa kṛṣṇa hare hare | hare rāma hare rāma rāma rāma hare hare ||",
    "englishMeaning": "A Krishna-first Gaudiya Vaishnava name-recitation. Other textual witnesses, including Rama-first Kali-Santarana Upanishad editions, differ.",
    "tamilMeaning": "கிருஷ்ணர் பெயரை முதலில் கூறும் வைணவ வழக்குப் பதிப்பு; சில நூல்பதிப்புகளில் ராமர் பெயர் முதலில் வரும்.",
    "sourceLabel": "ISKCON — Krishna-first Gaudiya Vaishnava recitation",
    "sourceUrl": "https://iskcon.org/meditation/",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "devi-durgayai",
    "tradition": "Devi",
    "title": "Om Dum Durgayai Namah",
    "tamil": "ஓம் தும் துர்காயை நம:",
    "devanagari": "ॐ दुं दुर्गायै नमः",
    "iast": "oṃ duṃ durgāyai namaḥ",
    "englishMeaning": "A popular devotional salutation to Durga; textual lineage needs editorial confirmation.",
    "tamilMeaning": "துர்கா தேவியை வணங்கும் வழக்குப் மந்திரம்; மூலப் பரம்பரைச் சரிபார்ப்பு தேவை.",
    "sourceLabel": "Drik Panchang — Durga Beeja Mantra (modern devotional listing; earliest textual lineage unestablished)",
    "sourceUrl": "https://www.drikpanchang.com/vedic-mantra/goddesses/durga/mantra/durga-beej-mantra.html",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "hanuman-namah",
    "tradition": "Hanuman",
    "title": "Om Hanumate Namah",
    "tamil": "ஓம் ஹனுமதே நம:",
    "devanagari": "ॐ हनुमते नमः",
    "iast": "oṃ hanumate namaḥ",
    "englishMeaning": "A common salutation to Hanuman; not identified here as a verse quotation.",
    "tamilMeaning": "அனுமனை வணங்கும் பொதுவான நாமஜபம்.",
    "sourceLabel": "Drik Panchang — Hanuman Sahasranamavali, name 1 (modern devotional witness)",
    "sourceUrl": "https://www.drikpanchang.com/deities-namavali/gods/god-hanuman/1000-hanuman-names.html?lang=en",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "lakshmi-mahalakshmi",
    "tradition": "Lakshmi",
    "title": "Om Shrim Mahalakshmyai Namah",
    "tamil": "ஓம் ஸ்ரீம் மஹாலக்ஷ்ம்யை நம:",
    "devanagari": "ॐ श्रीं महालक्ष्म्यै नमः",
    "iast": "oṃ śrīṃ mahālakṣmyai namaḥ",
    "englishMeaning": "A popular Lakshmi invocation; script and lineage require additional review.",
    "tamilMeaning": "மகாலட்சுமியை வணங்கும் வழக்குப் மந்திரம்; உரை சரிபார்ப்பு தேவை.",
    "sourceLabel": "Drik Panchang — Adi Lakshmi Ashtottara Shatanamavali, name 55 (modern devotional witness)",
    "sourceUrl": "https://www.drikpanchang.com/deities-namavali/goddesses/lakshmi/ashta-lakshmi/adi-lakshmi/108-adi-lakshmi-names.html",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "saraswati-aim",
    "tradition": "Saraswati",
    "title": "Om Aim Saraswatyai Namah",
    "tamil": "ஓம் ஐம் சரஸ்வத்யை நம:",
    "devanagari": "ॐ ऐं सरस्वत्यै नमः",
    "iast": "oṃ aiṃ sarasvatyai namaḥ",
    "englishMeaning": "A common Saraswati salutation; precise source tradition awaits review.",
    "tamilMeaning": "சரஸ்வதி தேவியை வணங்கும் வழக்குப் மந்திரம்; மூலச் சரிபார்ப்பு தேவை.",
    "sourceLabel": "Drik Panchang — Saraswati Moola Mantra, item 1 (modern devotional listing; earliest textual lineage unestablished)",
    "sourceUrl": "https://www.drikpanchang.com/vedic-mantra/goddesses/saraswati/saraswati-mantras.html",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "ayyappa-sharanam",
    "tradition": "Ayyappa",
    "title": "Swamiye Saranam Ayyappa",
    "tamil": "ஸ்வாமியே சரணம் ஐயப்பா",
    "devanagari": "",
    "iast": "svāmiye śaraṇam ayyappā",
    "englishMeaning": "A widely used Tamil and Malayalam devotional refuge invocation.",
    "tamilMeaning": "ஐயப்பனைச் சரணடையும் பக்தி முழக்கம்.",
    "sourceLabel": "Ayyappa Mantras & Prayers (devotional source)",
    "sourceUrl": "https://www.swamiayyappan.in/mantras",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "surya-gayatri",
    "tradition": "Surya / Vedic",
    "title": "Gayatri (Savitri) Mantra",
    "tamil": "தத் ஸவிதுர் வரேண்யம் பர்கோ தேவஸ்ய தீமஹி । தியோ யோ ந: ப்ரசோதயாத் ॥",
    "devanagari": "तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥",
    "iast": "tat savitur vareṇyaṃ bhargo devasya dhīmahi | dhiyo yo naḥ pracodayāt ||",
    "englishMeaning": "A meditation on Savitr's radiance and a prayer for the guidance of understanding; Vedic accents omitted.",
    "tamilMeaning": "சவிதாவின் ஒளியைத் தியானித்து அறிவு வழிநடத்தப்பட வேண்டுமென வேண்டுதல்.",
    "sourceLabel": "Rigveda 3.62.10",
    "sourceUrl": "https://vedshala.org/rigveda/3/62/10",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "shiva-mahamrityunjaya",
    "tradition": "Shiva / Vedic",
    "title": "Mahamrityunjaya Mantra",
    "tamil": "த்ரயம்பகம் யஜாமஹே ஸுகந்திம் புஷ்டிவர்தனம் । உர்வாருகமிவ பந்தனான் ம்ருத்யோர் முக்ஷீய மாம்ருதாத் ॥",
    "devanagari": "त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥",
    "iast": "tryambakaṃ yajāmahe sugandhiṃ puṣṭivardhanam | urvārukam iva bandhanān mṛtyor mukṣīya māmṛtāt ||",
    "englishMeaning": "A Vedic invocation to Tryambaka asking for release from the bonds of mortality; no health outcome is promised.",
    "tamilMeaning": "மரணத்தின் கட்டுப்பாட்டிலிருந்து விடுதலை வேண்டி த்ரயம்பகரை வழிபடும் வேத மந்திரம்.",
    "sourceLabel": "Rigveda 7.59.12",
    "sourceUrl": "https://www.vedicsamhita.in/vedas/rigveda/7/59",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "peace-asato",
    "tradition": "Peace / Upanishad",
    "title": "Asato Ma Sad Gamaya",
    "tamil": "அஸதோ மா ஸத் கமய । தமஸோ மா ஜ்யோதிர் கமய । ம்ருத்யோர் மா அம்ருதம் கமய ॥",
    "devanagari": "असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥",
    "iast": "asato mā sad gamaya | tamaso mā jyotir gamaya | mṛtyor mā amṛtaṃ gamaya ||",
    "englishMeaning": "A prayer to move from unreality to reality, from darkness to light, and from mortality to immortality.",
    "tamilMeaning": "உண்மையற்ற நிலையிலிருந்து உண்மைக்கும், இருளிலிருந்து ஒளிக்கும், மரணத்திலிருந்து மரணமற்ற நிலைக்கும் வழிநடத்த வேண்டுதல்.",
    "sourceLabel": "Brihadaranyaka Upanishad 1.3.28",
    "sourceUrl": "https://heritage.iitk.ac.in/BRU/1.3.28",
    "evidenceStatus": "linked-reference"
  },
  {
    "id": "peace-saha",
    "tradition": "Peace / Upanishad",
    "title": "Saha Navavatu",
    "tamil": "ஓம் ஸஹ நாவவது । ஸஹ நௌ புனக்து । ஸஹ வீர்யம் கரவாவஹை । தேஜஸ்வி நாவதீதமஸ்து மா வித்விஷாவஹை । ஓம் சாந்தி: சாந்தி: சாந்தி: ॥",
    "devanagari": "ॐ सह नाववतु । सह नौ भुनक्तु । सह वीर्यं करवावहै । तेजस्वि नावधीतमस्तु मा विद्विषावहै । ॐ शान्तिः शान्तिः शान्तिः ॥",
    "iast": "oṃ saha nāvavatu | saha nau bhunaktu | saha vīryaṃ karavāvahai | tejasvi nāvadhītam astu mā vidviṣāvahai | oṃ śāntiḥ śāntiḥ śāntiḥ ||",
    "englishMeaning": "A shared prayer for protection, nourishment, strength in study and freedom from hostility.",
    "tamilMeaning": "ஆசிரியரும் மாணவரும் சேர்ந்து கல்வியில் வலிமை, ஒற்றுமை, அமைதி வேண்டுதல்.",
    "sourceLabel": "Taittiriya Upanishad 2 invocation",
    "sourceUrl": "https://upanishads.org.in/u/taittiriya/p/2.invocation",
    "evidenceStatus": "linked-reference"
  }
];
export const japaGoals = [11, 21, 54, 108, 1008] as const;
export const MANTRA_EDITORIAL_STATUS = "Candidate texts — not yet approved for production publication";

/** Count one completed recitation; lowering a goal must never erase prior repetitions. */
export function stepJapaCount(count: number, goal: number, step: 1 | -1): number {
  if (step === -1) return Math.max(0, count - 1);
  return count >= goal ? count : Math.min(goal, count + 1);
}
