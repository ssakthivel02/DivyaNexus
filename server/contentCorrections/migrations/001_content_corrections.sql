CREATE TABLE IF NOT EXISTS content_corrections (
  id varchar(200) PRIMARY KEY,
  category text NOT NULL CHECK (category IN (
    'source-attribution','citation-mismatch','transliteration','translation',
    'tradition-context','unsupported-claim','accessibility','ask-divya-response','other'
  )),
  concern text NOT NULL CHECK (char_length(concern) BETWEEN 1 AND 2000),
  page_url text CHECK (page_url IS NULL OR char_length(page_url) BETWEEN 1 AND 2048),
  record_id varchar(200),
  ask_divya_request_id varchar(200),
  questioned_text text CHECK (questioned_text IS NULL OR char_length(questioned_text) BETWEEN 1 AND 4000),
  evidence text CHECK (evidence IS NULL OR char_length(evidence) BETWEEN 1 AND 4000),
  status text NOT NULL CHECK (status IN (
    'submitted','triage','source-review','needs-review','resolved','closed'
  )),
  submitted_at timestamptz NOT NULL,
  CHECK (page_url IS NOT NULL OR record_id IS NOT NULL OR ask_divya_request_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS content_corrections_submitted_at_idx
  ON content_corrections (submitted_at);

CREATE INDEX IF NOT EXISTS content_corrections_status_idx
  ON content_corrections (status);

CREATE TABLE IF NOT EXISTS content_correction_deletion_audit (
  id varchar(200) PRIMARY KEY,
  correction_id varchar(200) NOT NULL,
  action text NOT NULL CHECK (action = 'deleted'),
  occurred_at timestamptz NOT NULL,
  previous_status text NOT NULL CHECK (previous_status IN (
    'submitted','triage','source-review','needs-review','resolved','closed'
  )),
  actor_ref varchar(200) NOT NULL
);

CREATE INDEX IF NOT EXISTS content_correction_deletion_audit_correction_idx
  ON content_correction_deletion_audit (correction_id);

CREATE INDEX IF NOT EXISTS content_correction_deletion_audit_occurred_at_idx
  ON content_correction_deletion_audit (occurred_at);
