import type {
  ContentCorrectionQueueStore,
  ContentCorrectionRetentionPolicy,
} from "./contract";

export interface ContentCorrectionRetentionExecutionApproval {
  approved: true;
}

export interface ContentCorrectionRetentionExecutionOptions {
  store: ContentCorrectionQueueStore;
  retentionPolicy: ContentCorrectionRetentionPolicy;
  now?: () => Date;
}

export interface ContentCorrectionRetentionExecutionResult {
  cutoffIso: string;
  purged: number;
}

export function calculateContentCorrectionRetentionCutoff(
  now: Date,
  retentionPolicy: ContentCorrectionRetentionPolicy,
): string {
  const nowMs = now.getTime();
  if (!Number.isFinite(nowMs)) throw new Error("INVALID_CORRECTION_RETENTION_NOW");

  const cutoffMs = nowMs - retentionPolicy.retentionMs;
  if (!Number.isSafeInteger(cutoffMs)) {
    throw new Error("INVALID_CORRECTION_RETENTION_CUTOFF");
  }

  return new Date(cutoffMs).toISOString();
}

export class ContentCorrectionRetentionExecutionCoordinator {
  private readonly now: () => Date;

  constructor(private readonly options: ContentCorrectionRetentionExecutionOptions) {
    this.now = options.now ?? (() => new Date());
  }

  previewCutoff(): string {
    return calculateContentCorrectionRetentionCutoff(this.now(), this.options.retentionPolicy);
  }

  async execute(
    approval?: ContentCorrectionRetentionExecutionApproval,
  ): Promise<ContentCorrectionRetentionExecutionResult> {
    if (!approval || approval.approved !== true) {
      throw new Error("CORRECTION_RETENTION_EXECUTION_NOT_APPROVED");
    }

    const cutoffIso = this.previewCutoff();
    const purged = await this.options.store.purgeBefore(cutoffIso);

    if (!Number.isSafeInteger(purged) || purged < 0) {
      throw new Error("INVALID_CORRECTION_RETENTION_PURGE_RESULT");
    }

    return { cutoffIso, purged };
  }
}
