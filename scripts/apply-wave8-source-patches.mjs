import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

function read(path) {
  return readFileSync(resolve(root, path), "utf8");
}

function write(path, content) {
  writeFileSync(resolve(root, path), content);
}

function replaceOnce(content, before, after, label) {
  if (!content.includes(before)) throw new Error(`Patch marker not found: ${label}`);
  return content.replace(before, after);
}

function replaceAllRequired(content, before, after, expected, label) {
  const count = content.split(before).length - 1;
  if (count !== expected) throw new Error(`Expected ${expected} occurrences for ${label}; found ${count}`);
  return content.split(before).join(after);
}

// Homepage: the owner artwork existed but was never rendered.
{
  const path = "client/src/pages/Home.tsx";
  let content = read(path);
  content = replaceOnce(
    content,
    'import { Reveal } from "@/components/Reveal";\nimport "@/home-wave2.css";',
    'import { Reveal } from "@/components/Reveal";\nimport { PortalArtworkPanel } from "@/components/PortalArtworkPanel";\nimport "@/home-wave2.css";',
    "Home artwork import",
  );
  content = replaceOnce(
    content,
    '<Link className="button button--glass" href="/explore"><Compass size={17} aria-hidden="true" />Explore the universe</Link>',
    '<Link className="button button--glass" href="/explore"><Compass size={17} aria-hidden="true" />Explore the universe</Link><a className="button button--glass" href="#owner-portal-vision"><Stars size={17} aria-hidden="true" />View portal vision</a>',
    "Home artwork hero action",
  );
  content = replaceOnce(
    content,
    `        <section className="home-evidence-strip" aria-label="Current collection status">
          <div><strong>{records.filter((record) => record.category === "Scripture").length}</strong><span>source-aware scripture records</span></div>
          <div><strong>{deityEditorialCards.length}</strong><span>deity orientation pathways</span></div>
          <div><strong>{knowledgeCategories.length}</strong><span>knowledge destinations</span></div>
          <div><strong>{heroFrames.length}</strong><span>cinematic hero scenes</span></div>
        </section>

        <section className="cinema-section cinema-section--wisdom"`,
    `        <section className="home-evidence-strip" aria-label="Current collection status">
          <div><strong>{records.filter((record) => record.category === "Scripture").length}</strong><span>source-aware scripture records</span></div>
          <div><strong>{deityEditorialCards.length}</strong><span>deity orientation pathways</span></div>
          <div><strong>{knowledgeCategories.length}</strong><span>knowledge destinations</span></div>
          <div><strong>{heroFrames.length}</strong><span>cinematic hero scenes</span></div>
        </section>

        <PortalArtworkPanel />

        <section className="cinema-section cinema-section--wisdom"`,
    "Home artwork render",
  );
  write(path, content);
}

// Scripture reader: add language focus, larger range, bilingual word notes and direct speech controls.
{
  const path = "client/src/pages/ScriptureReader.tsx";
  let content = read(path);
  content = replaceOnce(
    content,
    'import { Link } from "wouter";\nimport { ASSETS, records, type KnowledgeRecord } from "@/data/content";',
    'import { Link } from "wouter";\nimport { SpeechControls, type SpeechItem } from "@/components/SpeechControls";\nimport { ASSETS, records, type KnowledgeRecord } from "@/data/content";',
    "Reader speech import",
  );
  content = replaceOnce(
    content,
    '  const [fontScale, setFontScale] = useState(Number(getPreference("fontSize", "1")) || 1);',
    '  const [fontScale, setFontScale] = useState(Number(getPreference("fontSize", "1.08")) || 1.08);\n  const [readerLanguage, setReaderLanguage] = useState<"both" | "tamil" | "english">("both");',
    "Reader language state",
  );
  content = replaceOnce(
    content,
    '  const displayStatus = verified?.status ?? record.reviewStatus;\n\n  const changeScale = (next: number) => {',
    `  const displayStatus = verified?.status ?? record.reviewStatus;
  const speechItems: SpeechItem[] = verified
    ? [
        { id: \`${record.id}-tamil\`, label: "Tamil meaning", tamilLabel: "தமிழ் பொருள்", text: verified.tamilTranslation, lang: "ta-IN", rate: 0.82, sourceLabel: \`${displayTitle} · Tamil editorial translation\` },
        { id: \`${record.id}-sanskrit\`, label: "Sanskrit text", tamilLabel: "சமஸ்கிருத மூலம்", text: verified.originalText, lang: "sa-IN", rate: 0.72, sourceLabel: \`${displayTitle} · verified primary text; device speech does not preserve Vedic accents\` },
        { id: \`${record.id}-iast\`, label: "IAST transliteration", tamilLabel: "ஒலிப்பெயர்ப்பு", text: verified.transliteration, lang: "en-GB", rate: 0.7, sourceLabel: \`${displayTitle} · readable transliteration\` },
        { id: \`${record.id}-english\`, label: "English meaning", tamilLabel: "ஆங்கில பொருள்", text: verified.englishTranslation, lang: "en-GB", rate: 0.88, sourceLabel: \`${displayTitle} · English editorial translation\` },
      ]
    : [
        { id: \`${record.id}-tamil\`, label: "Tamil overview", tamilLabel: "தமிழ் சுருக்கம்", text: record.tamilMeaning, lang: "ta-IN", rate: 0.82, sourceLabel: \`${displayTitle} · educational overview\` },
        { id: \`${record.id}-english\`, label: "English overview", tamilLabel: "ஆங்கில சுருக்கம்", text: record.englishMeaning, lang: "en-GB", rate: 0.88, sourceLabel: \`${displayTitle} · educational overview\` },
      ];

  const changeScale = (next: number) => {`,
    "Reader speech items",
  );
  content = replaceOnce(
    content,
    '    const value = Math.min(1.25, Math.max(0.87, next));',
    '    const value = Math.min(1.45, Math.max(0.95, next));',
    "Reader font range",
  );
  content = replaceOnce(
    content,
    `                <button
                  className={\`reader-tool \${showCommentary ? "is-active" : ""}\`}
                  onClick={() => setShowCommentary((value) => !value)}
                >
                  Commentary
                </button>
              </div>
            </div>`,
    `                <button
                  className={\`reader-tool \${showCommentary ? "is-active" : ""}\`}
                  onClick={() => setShowCommentary((value) => !value)}
                >
                  Commentary
                </button>
              </div>
              <div className="reader-language-switch" role="group" aria-label="Reader language focus">
                <button type="button" className={readerLanguage === "both" ? "is-active" : ""} aria-pressed={readerLanguage === "both"} onClick={() => setReaderLanguage("both")}>Tamil + English</button>
                <button type="button" className={readerLanguage === "tamil" ? "is-active" : ""} aria-pressed={readerLanguage === "tamil"} onClick={() => setReaderLanguage("tamil")}>தமிழ் மட்டும்</button>
                <button type="button" className={readerLanguage === "english" ? "is-active" : ""} aria-pressed={readerLanguage === "english"} onClick={() => setReaderLanguage("english")}>English only</button>
              </div>
            </div>`,
    "Reader language toolbar",
  );
  content = replaceOnce(
    content,
    `                  <div className="reader-meaning-grid">
                    <div>
                      <p className="reader-label">Tamil · DivyaNexus editorial translation</p>
                      <p className="reader-translation" lang="ta">
                        {verified.tamilTranslation}
                      </p>
                    </div>
                    <div>
                      <p className="reader-label">English · DivyaNexus editorial translation</p>
                      <p className="reader-translation">{verified.englishTranslation}</p>
                    </div>
                  </div>`,
    `                  <div className="reader-meaning-grid" data-reader-language={readerLanguage}>
                    <div className="reader-language-panel reader-language-panel--tamil">
                      <p className="reader-label">Tamil · DivyaNexus editorial translation</p>
                      <p className="reader-translation" lang="ta">
                        {verified.tamilTranslation}
                      </p>
                    </div>
                    <div className="reader-language-panel reader-language-panel--english">
                      <p className="reader-label">English · DivyaNexus editorial translation</p>
                      <p className="reader-translation">{verified.englishTranslation}</p>
                    </div>
                  </div>`,
    "Verified bilingual reader panels",
  );
  content = replaceOnce(
    content,
    `                  <div className="reader-meaning-grid">
                    <div>
                      <p className="reader-label">Tamil meaning · educational overview</p>
                      <p className="reader-translation" lang="ta">{record.tamilMeaning}</p>
                    </div>
                    <div>
                      <p className="reader-label">English meaning · educational overview</p>
                      <p className="reader-translation">{record.englishMeaning}</p>
                    </div>
                  </div>`,
    `                  <div className="reader-meaning-grid" data-reader-language={readerLanguage}>
                    <div className="reader-language-panel reader-language-panel--tamil">
                      <p className="reader-label">Tamil meaning · educational overview</p>
                      <p className="reader-translation" lang="ta">{record.tamilMeaning}</p>
                    </div>
                    <div className="reader-language-panel reader-language-panel--english">
                      <p className="reader-label">English meaning · educational overview</p>
                      <p className="reader-translation">{record.englishMeaning}</p>
                    </div>
                  </div>`,
    "Overview bilingual reader panels",
  );
  content = replaceOnce(
    content,
    '<strong>{note.term}</strong><br />{note.meaning}',
    '<strong>{note.term}</strong><br />{note.meaning}{note.tamilMeaning && <span className="reader-word-note__tamil" lang="ta">{note.tamilMeaning}</span>}',
    "Reader Tamil word notes",
  );
  content = replaceOnce(
    content,
    `              <div className="reader-actions">
                <Link className="button" href="/audio">
                  <Headphones size={15} aria-hidden="true" />Listen
                </Link>`,
    `              <div id="reader-audio">
                <SpeechControls items={speechItems} title={\`Listen to \${displayTitle}\`} compact />
              </div>

              <div className="reader-actions">
                <a className="button" href="#reader-audio">
                  <Headphones size={15} aria-hidden="true" />Listen here
                </a>`,
    "Reader embedded audio",
  );
  write(path, content);
}

// Add Tamil explanations to every current verified word note.
{
  const path = "client/src/data/verifiedScripture.ts";
  let content = read(path);
  content = replaceOnce(
    content,
    '  wordNotes: Array<{ term: string; meaning: string }>;',
    '  wordNotes: Array<{ term: string; meaning: string; tamilMeaning?: string }>;',
    "Tamil word-note type",
  );

  const notes = new Map([
    ['{ term: "Agni", meaning: "The invoked divine fire and ritual mediator in this hymn." }', '{ term: "Agni", meaning: "The invoked divine fire and ritual mediator in this hymn.", tamilMeaning: "இந்த மந்திரத்தில் அழைக்கப்படும் தெய்வீக அக்னியும் யாகத்தின் நடுவரும்." }'],
    ['{ term: "purohita", meaning: "One placed in front; the priest who serves at the forefront." }', '{ term: "purohita", meaning: "One placed in front; the priest who serves at the forefront.", tamilMeaning: "முன்னிலையில் அமர்த்தப்பட்டவர்; சடங்கின் முன்பணியை நிறைவேற்றும் புரோகிதர்." }'],
    ['{ term: "ṛtvij", meaning: "An officiant who performs the rite at the proper season or time." }', '{ term: "ṛtvij", meaning: "An officiant who performs the rite at the proper season or time.", tamilMeaning: "உரிய காலத்தில் சடங்கை நடத்தும் யாக அதிகாரி." }'],
    ['{ term: "hotṛ", meaning: "The invoking or reciting priest." }', '{ term: "hotṛ", meaning: "The invoking or reciting priest.", tamilMeaning: "அழைப்புப் பாடலை ஓதும் அல்லது உரைக்கும் புரோகிதர்." }'],
    ['{ term: "Pūṣan", meaning: "A Vedic deity associated in this hymn with roads, guidance, and safe passage." }', '{ term: "Pūṣan", meaning: "A Vedic deity associated in this hymn with roads, guidance, and safe passage.", tamilMeaning: "இந்த மந்திரத்தில் பாதை, வழிகாட்டல், பாதுகாப்பான பயணம் ஆகியவற்றுடன் தொடர்புடைய வேதத் தெய்வம்." }'],
    ['{ term: "adhvan", meaning: "Road, path, or journey." }', '{ term: "adhvan", meaning: "Road, path, or journey.", tamilMeaning: "சாலை, பாதை அல்லது பயணம்." }'],
    ['{ term: "aṃhas", meaning: "Constraint, distress, or obstruction; the nuance depends on context." }', '{ term: "aṃhas", meaning: "Constraint, distress, or obstruction; the nuance depends on context.", tamilMeaning: "கட்டுப்பாடு, துயரம் அல்லது தடை; பொருள் சூழலைப் பொறுத்தது." }'],
    ['{ term: "ketavaḥ", meaning: "Signs, banners, or rays; here understood as the Sun\'s luminous rays." }', '{ term: "ketavaḥ", meaning: "Signs, banners, or rays; here understood as the Sun\'s luminous rays.", tamilMeaning: "அடையாளங்கள், கொடிகள் அல்லது கதிர்கள்; இங்கு சூரியனின் ஒளிக்கதிர்களாக எடுத்துக்கொள்ளப்படுகிறது." }'],
    ['{ term: "jātavedas", meaning: "A knower of beings or births; an epithet whose nuance depends on Vedic context." }', '{ term: "jātavedas", meaning: "A knower of beings or births; an epithet whose nuance depends on Vedic context.", tamilMeaning: "உயிர்கள் அல்லது பிறப்புகளை அறிந்தவர்; வேதச் சூழலின்படி நுணுக்கம் மாறும் சிறப்புப்பெயர்." }'],
    ['{ term: "dṛśe viśvāya", meaning: "For the sight of all; so that all may see." }', '{ term: "dṛśe viśvāya", meaning: "For the sight of all; so that all may see.", tamilMeaning: "அனைவரும் காணும்படி; எல்லோரின் பார்வைக்காக." }'],
    ['{ term: "adhikāra", meaning: "Scope, claim, authority, or responsibility in relation to action." }', '{ term: "adhikāra", meaning: "Scope, claim, authority, or responsibility in relation to action.", tamilMeaning: "செயலுடன் தொடர்புடைய உரிமை, அதிகார வரம்பு அல்லது பொறுப்பு." }'],
    ['{ term: "phala", meaning: "Fruit or result of action." }', '{ term: "phala", meaning: "Fruit or result of action.", tamilMeaning: "செயலின் பலன் அல்லது முடிவு." }'],
    ['{ term: "akarma", meaning: "Inaction or non-performance of action." }', '{ term: "akarma", meaning: "Inaction or non-performance of action.", tamilMeaning: "செயலின்மை அல்லது செயலை நிறைவேற்றாத நிலை." }'],
    ['{ term: "dharma", meaning: "A context-sensitive term involving sustaining order, responsibility, and right conduct." }', '{ term: "dharma", meaning: "A context-sensitive term involving sustaining order, responsibility, and right conduct.", tamilMeaning: "ஒழுங்கைத் தாங்குதல், பொறுப்பு, நல்வழி ஆகியவற்றைச் சார்ந்த சூழல் உணர்வுடைய சொல்." }'],
    ['{ term: "glāni", meaning: "Decline, weakening, or diminishment." }', '{ term: "glāni", meaning: "Decline, weakening, or diminishment.", tamilMeaning: "சரிவு, தளர்ச்சி அல்லது குறைதல்." }'],
    ['{ term: "sṛjāmi ātmānam", meaning: "I bring forth or manifest myself; traditions explain the phrase in different ways." }', '{ term: "sṛjāmi ātmānam", meaning: "I bring forth or manifest myself; traditions explain the phrase in different ways.", tamilMeaning: "நான் என்னை வெளிப்படுத்துகிறேன்; பல மரபுகள் இந்த சொற்றொடரை வேறுபட்ட முறையில் விளக்குகின்றன." }'],
  ]);

  for (const [before, after] of notes) {
    content = replaceOnce(content, before, after, `Tamil word note ${before.slice(0, 40)}`);
  }
  write(path, content);
}

// Bump the offline shell and align validators/workflows with Wave 8.
{
  const path = "client/public/sw.js";
  write(path, replaceOnce(read(path), "divyanexus-stage-b-wave7-v1", "divyanexus-stage-b-wave8-v1", "Service worker Wave 8 cache"));
}
{
  const path = "scripts/validate-pwa-assets.mjs";
  write(path, replaceOnce(read(path), "divyanexus-stage-b-wave7-v1", "divyanexus-stage-b-wave8-v1", "PWA validator Wave 8 cache"));
}
{
  const path = ".github/workflows/production-smoke.yml";
  let content = read(path);
  content = replaceOnce(content, "divyanexus-stage-b-wave7-v1", "divyanexus-stage-b-wave8-v1", "Production smoke Wave 8 cache");
  content = replaceOnce(
    content,
    "          grep -Fq 'owner-selected-vision.webp' /tmp/sw_js\n",
    "          grep -Fq 'owner-selected-vision.webp' /tmp/sw_js\n          grep -Fq 'divyanexus-stage-b-wave8-v1' /tmp/sw_js\n",
    "Production smoke Wave 8 speech cache marker",
  );
  write(path, content);
}
{
  const path = ".github/workflows/pull-request-validation.yml";
  let content = read(path);
  content = replaceOnce(
    content,
    "      - name: Validate owner-selected artwork\n        run: node scripts/validate-owner-artwork.mjs\n",
    "      - name: Validate owner-selected artwork\n        run: node scripts/validate-owner-artwork.mjs\n\n      - name: Validate Wave 8 readability and audio\n        run: node scripts/validate-readability-audio-wave8.mjs\n",
    "PR Wave 8 validator",
  );
  write(path, content);
}
{
  const path = ".github/workflows/deploy-react-app.yml";
  let content = read(path);
  content = replaceOnce(
    content,
    "          node scripts/validate-owner-artwork.mjs\n",
    "          node scripts/validate-owner-artwork.mjs\n          node scripts/validate-readability-audio-wave8.mjs\n",
    "Deploy Wave 8 validator",
  );
  write(path, content);
}
{
  const path = ".github/workflows/nightly-quality.yml";
  let content = read(path);
  content = replaceOnce(
    content,
    "          node scripts/validate-owner-artwork.mjs\n",
    "          node scripts/validate-owner-artwork.mjs\n          node scripts/validate-readability-audio-wave8.mjs\n",
    "Nightly Wave 8 validator",
  );
  content = replaceOnce(
    content,
    "          tests/e2e/owner-artwork.spec.ts\n",
    "          tests/e2e/owner-artwork.spec.ts\n          tests/e2e/readability-audio-wave8.spec.ts\n",
    "Nightly Wave 8 Playwright",
  );
  write(path, content);
}

// The patcher and its workflow are intentionally one-time implementation tools.
unlinkSync(resolve(root, "scripts/apply-wave8-source-patches.mjs"));
unlinkSync(resolve(root, ".github/workflows/apply-wave8-source-patches.yml"));

console.log("Wave 8 source patches applied successfully.");
