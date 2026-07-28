export interface VerifiedScriptureRecord {
  id: string;
  title: string;
  tamilTitle: string;
  reference: string;
  originalLanguage: "Vedic Sanskrit" | "Sanskrit";
  originalText: string;
  transliteration: string;
  tamilTranslation: string;
  englishTranslation: string;
  wordNotes: Array<{ term: string; meaning: string; tamilMeaning?: string }>;
  sourceName: string;
  sourceUrl: string;
  sourceNote: string;
  status: "Verified primary text · DivyaNexus editorial translation";
  reviewedDate: string;
}

/**
 * Source-grounded scripture passages used by the reader.
 * Original Sanskrit is reproduced from the linked source. Vedic accent marks are omitted
 * for cross-device readability. Tamil and English are concise DivyaNexus editorial translations.
 */
export const verifiedScriptureRecords: Record<string, VerifiedScriptureRecord> = {
  "rig-veda-1-1-1": {
    id: "rig-veda-1-1-1",
    title: "Rig Veda 1.1.1 · Agni",
    tamilTitle: "ரிக் வேதம் 1.1.1 · அக்னி",
    reference: "Mandala 1, Sukta 1, Mantra 1",
    originalLanguage: "Vedic Sanskrit",
    originalText: "अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् ।\nहोतारं रत्नधातमम् ॥",
    transliteration: "agnim īḷe purohitaṃ yajñasya devam ṛtvijam | hotāraṃ ratnadhātamam ||",
    tamilTranslation: "யாகத்தின் புரோகிதனாகவும், தெய்வீக ருத்விகாகவும், அழைப்பாளராகவும், செல்வங்களை மிகுதியாக வழங்குபவராகவும் விளங்கும் அக்னியை நான் போற்றுகிறேன்.",
    englishTranslation: "I praise Agni, the household priest, the divine officiant of the sacrifice, the invoker, and the foremost bestower of treasures.",
    wordNotes: [
      { term: "Agni", meaning: "The invoked divine fire and ritual mediator in this hymn.", tamilMeaning: "இந்த மந்திரத்தில் அழைக்கப்படும் தெய்வீக அக்னியும் யாகத்தின் நடுவரும்." },
      { term: "purohita", meaning: "One placed in front; the priest who serves at the forefront.", tamilMeaning: "முன்னிலையில் அமர்த்தப்பட்டவர்; சடங்கின் முன்பணியை நிறைவேற்றும் புரோகிதர்." },
      { term: "ṛtvij", meaning: "An officiant who performs the rite at the proper season or time.", tamilMeaning: "உரிய காலத்தில் சடங்கை நடத்தும் யாக அதிகாரி." },
      { term: "hotṛ", meaning: "The invoking or reciting priest.", tamilMeaning: "அழைப்புப் பாடலை ஓதும் அல்லது உரைக்கும் புரோகிதர்." },
    ],
    sourceName: "Vedic Heritage Portal — Rigveda, Shakala Shakha, Mandala 1, Sukta 1",
    sourceUrl: "https://vedicheritage.gov.in/rigveda-shakala-shakha-mandala-01-sukta-01/",
    sourceNote: "Primary-text reference from the Vedic Heritage Portal. Display text omits Vedic accent marks; consult the source for recitation context.",
    status: "Verified primary text · DivyaNexus editorial translation",
    reviewedDate: "27 July 2026",
  },
  "rig-veda-1-42": {
    id: "rig-veda-1-42",
    title: "Rig Veda 1.42.1 · Pūṣan",
    tamilTitle: "ரிக் வேதம் 1.42.1 · பூஷன்",
    reference: "Mandala 1, Sukta 42, Mantra 1",
    originalLanguage: "Vedic Sanskrit",
    originalText: "सं पूषन्नध्वनस्तिर व्यंहो विमुचो नपात् ।\nसक्ष्वा देव प्र णस्पुरः ॥",
    transliteration: "saṃ pūṣann adhvanas tira vy aṃho vimuco napāt | sakṣvā deva pra ṇas puraḥ ||",
    tamilTranslation: "ஓ பூஷனே, பாதையில் உள்ள தடையைத் தாண்டிச் செல்ல எங்களை வழிநடத்து; தெய்வீக வழிகாட்டியே, எங்களுக்கு முன்னால் சென்று துணைநில்.",
    englishTranslation: "O Pūṣan, lead us past the obstruction on the road; divine guide, go before us and accompany us.",
    wordNotes: [
      { term: "Pūṣan", meaning: "A Vedic deity associated in this hymn with roads, guidance, and safe passage.", tamilMeaning: "இந்த மந்திரத்தில் பாதை, வழிகாட்டல், பாதுகாப்பான பயணம் ஆகியவற்றுடன் தொடர்புடைய வேதத் தெய்வம்." },
      { term: "adhvan", meaning: "Road, path, or journey.", tamilMeaning: "சாலை, பாதை அல்லது பயணம்." },
      { term: "aṃhas", meaning: "Constraint, distress, or obstruction; the nuance depends on context.", tamilMeaning: "கட்டுப்பாடு, துயரம் அல்லது தடை; பொருள் சூழலைப் பொறுத்தது." },
    ],
    sourceName: "Sanskrit Wikisource — Rigveda Sukta 1.42",
    sourceUrl: "https://sa.wikisource.org/wiki/%E0%A4%8B%E0%A4%97%E0%A5%8D%E0%A4%B5%E0%A5%87%E0%A4%A6%E0%A4%83_%E0%A4%B8%E0%A5%82%E0%A4%95%E0%A5%8D%E0%A4%A4%E0%A4%82_%E0%A5%A7.%E0%A5%AA%E0%A5%A8",
    sourceNote: "Samhita text cross-checked against the Sanskrit text mirror. The concise translation avoids resolving debated compounds more narrowly than the source supports.",
    status: "Verified primary text · DivyaNexus editorial translation",
    reviewedDate: "27 July 2026",
  },
  "rig-veda-1-50": {
    id: "rig-veda-1-50",
    title: "Rig Veda 1.50.1 · Sūrya",
    tamilTitle: "ரிக் வேதம் 1.50.1 · சூர்யன்",
    reference: "Mandala 1, Sukta 50, Mantra 1",
    originalLanguage: "Vedic Sanskrit",
    originalText: "उदु त्यं जातवेदसं देवं वहन्ति केतवः ।\nदृशे विश्वाय सूर्यम् ॥",
    transliteration: "ud u tyaṃ jātavedasaṃ devaṃ vahanti ketavaḥ | dṛśe viśvāya sūryam ||",
    tamilTranslation: "ஒளிக்கதிர்கள் அனைத்தையும் அறிந்த தெய்வீக சூரியனை மேலே ஏந்துகின்றன; எல்லோரும் அவரைக் காணுமாறு அவர் வெளிப்படுகிறார்.",
    englishTranslation: "The luminous rays bear aloft the divine, all-knowing Sūrya, so that he may be seen by all.",
    wordNotes: [
      { term: "ketavaḥ", meaning: "Signs, banners, or rays; here understood as the Sun's luminous rays.", tamilMeaning: "அடையாளங்கள், கொடிகள் அல்லது கதிர்கள்; இங்கு சூரியனின் ஒளிக்கதிர்களாக எடுத்துக்கொள்ளப்படுகிறது." },
      { term: "jātavedas", meaning: "A knower of beings or births; an epithet whose nuance depends on Vedic context.", tamilMeaning: "உயிர்கள் அல்லது பிறப்புகளை அறிந்தவர்; வேதச் சூழலின்படி நுணுக்கம் மாறும் சிறப்புப்பெயர்." },
      { term: "dṛśe viśvāya", meaning: "For the sight of all; so that all may see.", tamilMeaning: "அனைவரும் காணும்படி; எல்லோரின் பார்வைக்காக." },
    ],
    sourceName: "Sanskrit Wikisource — Rigveda Sukta 1.50",
    sourceUrl: "https://sa.wikisource.org/wiki/%E0%A4%8B%E0%A4%97%E0%A5%8D%E0%A4%B5%E0%A5%87%E0%A4%A6%E0%A4%83_%E0%A4%B8%E0%A5%82%E0%A4%95%E0%A5%8D%E0%A4%A4%E0%A4%82_%E0%A5%A7.%E0%A5%AB%E0%A5%A6",
    sourceNote: "Samhita text cross-checked against the Sanskrit text mirror. Vedic accent marks are omitted in the reader display.",
    status: "Verified primary text · DivyaNexus editorial translation",
    reviewedDate: "27 July 2026",
  },
  "gita-2-47": {
    id: "gita-2-47",
    title: "Bhagavad Gita 2.47",
    tamilTitle: "பகவத் கீதை 2.47",
    reference: "Chapter 2, Verse 47",
    originalLanguage: "Sanskrit",
    originalText: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
    transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana | mā karmaphalahetur bhūr mā te saṅgo 'stv akarmaṇi ||",
    tamilTranslation: "உனக்குரிய உரிமை செயலில் மட்டுமே; அதன் பலன்களில் ஒருபோதும் இல்லை. செயலின் பலனை நோக்கமாகக் கொள்ளாதே; செயலின்மையிலும் பற்றுக் கொள்ளாதே.",
    englishTranslation: "Your claim is to action alone, never to its fruits. Do not make the fruits of action your motive, and do not become attached to inaction.",
    wordNotes: [
      { term: "adhikāra", meaning: "Scope, claim, authority, or responsibility in relation to action.", tamilMeaning: "செயலுடன் தொடர்புடைய உரிமை, அதிகார வரம்பு அல்லது பொறுப்பு." },
      { term: "phala", meaning: "Fruit or result of action.", tamilMeaning: "செயலின் பலன் அல்லது முடிவு." },
      { term: "akarma", meaning: "Inaction or non-performance of action.", tamilMeaning: "செயலின்மை அல்லது செயலை நிறைவேற்றாத நிலை." },
    ],
    sourceName: "Gita Supersite, IIT Kanpur — Bhagavad Gita 2.47",
    sourceUrl: "https://www.gitasupersite.iitk.ac.in/srimad?choose=1&field_chapter_value=2&field_nsutra_value=47&language=dv&show_mool=1",
    sourceNote: "Original Sanskrit verified against the Gita Supersite. Tamil and English are concise DivyaNexus editorial translations, not copied commentary.",
    status: "Verified primary text · DivyaNexus editorial translation",
    reviewedDate: "27 July 2026",
  },
  "gita-4-7": {
    id: "gita-4-7",
    title: "Bhagavad Gita 4.7",
    tamilTitle: "பகவத் கீதை 4.7",
    reference: "Chapter 4, Verse 7",
    originalLanguage: "Sanskrit",
    originalText: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।\nअभ्युत्थानमधर्मस्य तदाऽऽत्मानं सृजाम्यहम् ॥",
    transliteration: "yadā yadā hi dharmasya glānir bhavati bhārata | abhyutthānam adharmasya tadātmānaṃ sṛjāmy aham ||",
    tamilTranslation: "பாரதனே, தர்மம் தளர்ந்து அதர்மம் மேலெழும் போதெல்லாம், அப்போது நான் என்னை வெளிப்படுத்துகிறேன்.",
    englishTranslation: "Whenever dharma declines and adharma rises, O Bhārata, then I manifest myself.",
    wordNotes: [
      { term: "dharma", meaning: "A context-sensitive term involving sustaining order, responsibility, and right conduct.", tamilMeaning: "ஒழுங்கைத் தாங்குதல், பொறுப்பு, நல்வழி ஆகியவற்றைச் சார்ந்த சூழல் உணர்வுடைய சொல்." },
      { term: "glāni", meaning: "Decline, weakening, or diminishment.", tamilMeaning: "சரிவு, தளர்ச்சி அல்லது குறைதல்." },
      { term: "sṛjāmi ātmānam", meaning: "I bring forth or manifest myself; traditions explain the phrase in different ways.", tamilMeaning: "நான் என்னை வெளிப்படுத்துகிறேன்; பல மரபுகள் இந்த சொற்றொடரை வேறுபட்ட முறையில் விளக்குகின்றன." },
    ],
    sourceName: "Gita Supersite, IIT Kanpur — Bhagavad Gita 4.7",
    sourceUrl: "https://www.gitasupersite.iitk.ac.in/srimad?choose=1&field_chapter_value=4&field_nsutra_value=7&language=dv&show_mool=1",
    sourceNote: "Original Sanskrit verified against the Gita Supersite. Interpretive traditions differ on the theological implications of manifestation.",
    status: "Verified primary text · DivyaNexus editorial translation",
    reviewedDate: "27 July 2026",
  },
};

export function getVerifiedScriptureRecord(id: string) {
  return verifiedScriptureRecords[id];
}
