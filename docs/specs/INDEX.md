# Spec Index

One row per spec. **Status** here mirrors the spec file header (the header is authoritative). Keep this
to status only — no prose.

| Spec | Title | Status | Depends On |
|------|-------|--------|------------|
| SPEC-001 | Vitest Upgrade & Unit-Test Wiring | Draft | None |
| SPEC-002 | De-Supabase & Static Random Word Source | Planned | None |
| SPEC-003 | AWS-Native Hosting via OpenTofu (S3 + CloudFront) | Planned | SPEC-002 |

## Arcs (build order)

Group related specs and record the order to build them in.

- **Modernize & go AWS-native:** SPEC-001 (independent, do first) → SPEC-002 → SPEC-003
