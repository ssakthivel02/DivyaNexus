# DivyaNexus emergency production bypass procedure

This procedure exists for exceptional incidents where the normal pull-request path cannot restore or protect production quickly enough. It is not a convenience path and must never be used to avoid review, CI, or evidence requirements.

## 1. When a bypass is allowed

A bypass is allowed only when all of the following are true:

1. There is an active production-impacting incident or an imminent, material production risk.
2. Waiting for the normal review/merge path would materially increase user, security, availability, data-integrity, or content-trust impact.
3. The smallest safe change has been identified.
4. A rollback target is known before the bypass change is applied.
5. The evidence owner records the incident, decision, exact SHA, deployment target, and rollback path.

Routine feature work, deadline pressure, convenience, failed planning, or unavailable reviewers are not sufficient reasons for a bypass.

## 2. Required approval record

Before applying the bypass, record:

- incident or issue link;
- reason normal PR flow cannot be used in time;
- approving owner;
- exact pre-change production SHA;
- exact candidate SHA or change description;
- deployment target;
- expected user impact;
- rollback SHA/procedure;
- checks that were run before the change;
- known checks that could not be run and why.

If the situation is too urgent to complete the full record first, record at minimum the incident, approver, pre-change SHA, proposed change, and rollback target before deployment, then complete the remaining evidence immediately after stabilization.

## 3. Change constraints

An emergency bypass must:

- be the smallest change required to mitigate the incident;
- avoid unrelated refactors, dependency upgrades, content expansions, or formatting churn;
- never introduce or rotate secrets in source control;
- never disable security, content-trust, provenance, or authentication controls merely to make a deployment pass;
- preserve the ability to roll back cleanly;
- use a traceable commit SHA rather than an unrecorded local state.

If the proposed change cannot meet these constraints, use rollback or service isolation instead.

## 4. Minimum validation before deployment

Run every check that is feasible within the incident window. At minimum, when applicable:

- production build;
- focused unit/static validation for the changed area;
- route or API smoke check for the affected path;
- secret/configuration sanity check;
- artifact/SHA identity check.

Any skipped normal gate must be explicitly recorded. A skipped check is a known risk, not an implicit pass.

## 5. Deployment and live verification

After deployment:

1. Verify the deployed SHA or release identity.
2. Verify the affected route, API, or production behavior.
3. Confirm the incident symptom is mitigated.
4. Check for immediate regressions in adjacent critical paths.
5. Record the workflow/deployment identifier and timestamp.

If mitigation is not confirmed promptly, execute the pre-recorded rollback rather than stacking additional emergency changes.

## 6. Rollback triggers

Rollback immediately when any of the following occurs:

- the original incident is not mitigated;
- a new critical or high-severity regression appears;
- deployment identity cannot be verified;
- data integrity, authentication, authorization, privacy, or content-trust behavior becomes uncertain;
- required production health checks fail;
- the change cannot be explained or reproduced from the recorded commit.

The default rollback target is the last production-qualified `main` SHA unless the incident record identifies a safer known-good target.

## 7. Mandatory follow-up

Every bypass requires a normal follow-up PR after stabilization. The follow-up must:

- link the incident and bypass evidence;
- contain the final reviewed form of the change, or explicitly revert the temporary mitigation;
- run the complete normal CI/browser/release gates;
- document root cause and why bypass was necessary;
- document whether branch/ruleset/process changes are needed to reduce recurrence;
- link post-deployment production verification.

The bypass is not considered closed until the follow-up PR is merged or the bypass change is fully reverted and the incident record explains why.

## 8. Evidence template

Use this template in the related issue, PR, or incident record:

```text
Emergency bypass reason:
Incident/issue:
Approver:
Pre-change production SHA:
Bypass change SHA:
Deployment target:
Checks run:
Checks skipped + reason:
Deployment/workflow ID:
Live verification:
Rollback target/procedure:
Rollback trigger observed: yes/no
Follow-up PR:
Final disposition:
```

## 9. Relationship to normal governance

This procedure does not replace branch protection or required PR checks. Once repository rules are enabled, any configured emergency bypass permission should be narrowly scoped to authorized maintainers and should still require this evidence record and follow-up PR.
