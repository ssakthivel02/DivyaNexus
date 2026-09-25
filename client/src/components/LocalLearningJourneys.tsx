import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { Link } from "wouter";
import { localLearningJourneys } from "@/data/localLearningJourneys";
import {
  readLocalLearningProgress,
  resetLearningJourney,
  toggleLearningStep,
  type LocalLearningProgress,
} from "@/lib/localLearningProgress";
import "@/local-learning-journeys.css";

export function LocalLearningJourneys() {
  const [progress, setProgress] = useState<LocalLearningProgress>(() => readLocalLearningProgress());
  const completedCount = useMemo(
    () => Object.values(progress).reduce((sum, stepIds) => sum + stepIds.length, 0),
    [progress],
  );

  useEffect(() => {
    const refresh = () => setProgress(readLocalLearningProgress());
    window.addEventListener("divyanexus-learning-change", refresh);
    return () => window.removeEventListener("divyanexus-learning-change", refresh);
  }, []);

  return <section className="local-learning" aria-labelledby="local-learning-title">
    <div className="local-learning__intro">
      <div>
        <p className="scene-kicker">Local learning journeys</p>
        <h2 id="local-learning-title">Resume when you want. Nothing is due.</h2>
      </div>
      <div className="local-learning__privacy" role="note">
        <strong>{completedCount} steps marked locally</strong>
        <span>Stored only in this browser · no account · no streaks · no rankings</span>
      </div>
    </div>

    <div className="local-learning__grid">
      {localLearningJourneys.map((journey) => {
        const completed = new Set(progress[journey.id] ?? []);
        const done = journey.steps.filter((step) => completed.has(step.id)).length;
        return <article className="local-learning__journey" key={journey.id} data-learning-journey={journey.id}>
          <header>
            <p>{journey.pace}</p>
            <h3>{journey.title}<span lang="ta">{journey.tamilTitle}</span></h3>
            <p>{journey.detail}</p>
            <div className="local-learning__meter" aria-label={`${done} of ${journey.steps.length} steps marked complete`}>
              <span style={{ width: `${(done / journey.steps.length) * 100}%` }} />
            </div>
            <small>{done} of {journey.steps.length} marked · progress is optional</small>
          </header>

          <ol className="local-learning__steps">
            {journey.steps.map((step, index) => {
              const isDone = completed.has(step.id);
              return <li key={step.id} className={isDone ? "is-complete" : ""}>
                <button
                  type="button"
                  aria-pressed={isDone}
                  aria-label={`${isDone ? "Unmark" : "Mark"} ${step.title} complete`}
                  onClick={() => setProgress(toggleLearningStep(journey.id, step.id))}
                >
                  <span>{isDone ? <Check size={15} aria-hidden="true" /> : String(index + 1).padStart(2, "0")}</span>
                </button>
                <div>
                  <strong>{step.title}</strong>
                  <span lang="ta">{step.tamilTitle}</span>
                  <p>{step.detail}</p>
                </div>
                <Link href={step.route}>Open <ArrowRight size={14} aria-hidden="true" /></Link>
              </li>;
            })}
          </ol>

          {done > 0 && <button className="local-learning__reset" type="button" onClick={() => setProgress(resetLearningJourney(journey.id))}>
            <RotateCcw size={14} aria-hidden="true" />Reset this journey
          </button>}
        </article>;
      })}
    </div>

    <p className="local-learning__boundary">Marking a step is only a private reading aid. It does not certify mastery, religious attainment, attendance, or completion of formal study.</p>
  </section>;
}
