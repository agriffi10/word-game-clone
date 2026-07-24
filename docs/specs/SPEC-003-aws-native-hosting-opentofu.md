# Spec: AWS-Native Hosting via OpenTofu (S3 + CloudFront)

**ID:** SPEC-003  
**Status:** Draft  
**Last Updated:** 2026-07-24  
**Depends On:** SPEC-002 (app is static / backend-free before the hosting cutover)

## Overview

Move hosting off Netlify to AWS-native static hosting the same way the `s3-upload-portal` project does:
a private S3 bucket fronted by a CloudFront distribution (Origin Access Control, HTTPS-only, SPA
routing), all provisioned with OpenTofu. Deployment runs through GitHub Actions using AWS **OIDC** — no
long-lived AWS keys: infrastructure is `plan`-checked on pull requests and `apply`-ed on `main`, and the
built SPA is synced to S3 with a CloudFront invalidation on every push to `main`. The site uses the
default CloudFront domain (no custom domain, Route53, or ACM). Because Netlify currently also runs the
Cypress e2e suite before each deploy, that gate is re-homed into GitHub Actions so retiring Netlify does
not quietly drop end-to-end coverage.

## Scope

### In Scope

- An `infra/` OpenTofu root mirroring the reference conventions: `providers.tf` (OpenTofu `>= 1.8`, aws
  `~> 5.0`), `backend.tf` (S3 remote state + DynamoDB lock, configured via a gitignored `backend.conf`),
  `variables.tf`, `main.tf`, `outputs.tf`.
- A `base` module: the GitHub Actions OIDC provider and a deploy IAM role whose trust is scoped to this
  repo, with least-privilege permissions (S3 sync to the static bucket, CloudFront invalidation, and
  OpenTofu state access).
- An `app` module: a private S3 bucket (all public access blocked) and a CloudFront distribution with
  OAC, `default_root_object = index.html`, `redirect-to-https`, the Managed-CachingOptimized policy,
  custom `403/404 → /index.html` responses for SPA routing, the default CloudFront certificate, and a
  bucket policy allowing only the distribution via OAC.
- `infra/bootstrap/` with a `README.md` + `backend.conf.example` documenting the one-time creation of the
  state bucket + lock table and the first local `apply` that stands up the OIDC provider and deploy role.
- `.github/workflows/deploy-infra.yml`: on PRs touching `infra/**`, `tofu fmt -check` + `validate` +
  `plan` (posted to the PR); on push to `main` (and `workflow_dispatch`), `tofu apply` — all via OIDC.
- `.github/workflows/deploy-app.yml`: on push to `main`, build the SPA, assume the deploy role via OIDC,
  `aws s3 sync dist/ --delete`, then invalidate CloudFront.
- Re-home the Cypress e2e gate into `ci.yml` (run on PRs and push to `main`) so it gates merges into the
  branch that `deploy-app` ships.
- Retire Netlify from the repo side: update `README.md`, `CLAUDE.md`, and `docs/architecture.md` to
  describe the CloudFront hosting model and required GitHub secrets/vars, and document the manual Netlify
  dashboard disconnect the maintainer must perform.

### Out of Scope

- Custom domain, Route53 hosted zone, ACM certificate, and CloudFront alias — the default CloudFront
  domain is used; a custom domain is a future spec.
- Any backend/API/database/auth (Cognito) infrastructure — the app is a static SPA (SPEC-002); no Lambda
  or data tier here.
- Multiple environments — a single `prod` environment/state.
- WAF, access logging, cost/budget alarms, and other hardening — deferred.
- Preserving the existing Netlify URL or migrating its DNS — the site moves to the CloudFront URL.
- Automating the Netlify account disconnect — that is a manual dashboard action, only documented here.

---

## Functional Requirements

### FR-001: OpenTofu root scaffolding follows the reference conventions

#### Description:

The `infra/` root defines providers, remote state, variables, module wiring, and outputs consistent with
`s3-upload-portal`.

#### Acceptance Criteria:

- [ ] `infra/providers.tf` pins OpenTofu `>= 1.8` and aws `~> 5.0`, with `region = var.aws_region`.
- [ ] `infra/backend.tf` declares an S3 backend with `encrypt = true` and a project-scoped `key`, taking
      bucket/lock/region from a gitignored `backend.conf` (never committed).
- [ ] `infra/variables.tf` defines at least `aws_region`, `project_name`, `environment`, `github_repo`,
      `state_bucket`, `state_lock_table`.
- [ ] `tofu fmt -check -recursive` and `tofu validate` pass.

### FR-002: `base` module provisions GitHub OIDC + a least-privilege deploy role

#### Description:

CI authenticates to AWS with OIDC (no stored keys); the deploy role can do exactly what deploy needs.

#### Acceptance Criteria:

- [ ] An `aws_iam_openid_connect_provider` for `token.actions.githubusercontent.com` exists (or is
      referenced if pre-created in bootstrap).
- [ ] A deploy role trusts only `github_repo` (its `main` branch and PRs), not `*`.
- [ ] The role's permissions cover S3 `sync` to the static bucket, `cloudfront:CreateInvalidation`, and
      OpenTofu state read/write (state bucket + lock table) — and nothing broader.
- [ ] The role ARN is exposed as an output.

### FR-003: `app` module serves the SPA privately via CloudFront + OAC

#### Description:

A private S3 bucket holds the build; CloudFront serves it over HTTPS with SPA-friendly routing.

#### Acceptance Criteria:

- [ ] The S3 bucket blocks all public access; no public bucket policy or ACL grants read.
- [ ] A CloudFront OAC is attached and the bucket policy allows `s3:GetObject` only from the distribution
      (via `AWS:SourceArn`).
- [ ] The distribution sets `default_root_object = index.html`, `viewer_protocol_policy =
      redirect-to-https`, and custom `403` and `404` responses returning `/index.html` with code `200`.
- [ ] Outputs expose the bucket name, distribution ID, and CloudFront domain name.
- [ ] Loading the CloudFront domain serves the app over HTTPS, and a deep link / refresh on a client route
      returns the app (not an S3 error).

### FR-004: Bootstrap is documented and reproducible

#### Description:

The remote-state backend and first apply are documented so a new operator can stand the stack up.

#### Acceptance Criteria:

- [ ] `infra/bootstrap/README.md` describes creating the state S3 bucket + DynamoDB lock table and the
      initial local `tofu apply` (admin credentials) that creates the OIDC provider + deploy role.
- [ ] `infra/bootstrap/backend.conf.example` shows the backend keys with placeholder values; the real
      `backend.conf` is gitignored.
- [ ] `.gitignore` excludes `infra/**/backend.conf` and OpenTofu local state/`.terraform/`.

### FR-005: `deploy-infra` workflow plans on PRs and applies on main via OIDC

#### Description:

Infrastructure changes are reviewed as a plan before being applied.

#### Acceptance Criteria:

- [ ] On `pull_request` touching `infra/**`: `tofu fmt -check`, `validate`, and `plan` run; the plan is
      posted to the PR.
- [ ] On `push` to `main` touching `infra/**` (and on `workflow_dispatch`): `tofu apply -auto-approve` runs.
- [ ] Both jobs authenticate via OIDC (`permissions: id-token: write`) using the deploy role — no static
      AWS keys are stored.

### FR-006: `deploy-app` workflow builds, syncs, and invalidates on main via OIDC

#### Description:

Pushing to `main` publishes the built SPA to S3 and refreshes the CDN.

#### Acceptance Criteria:

- [ ] On `push` to `main`: `npm ci` + `npm run build`, assume the deploy role via OIDC, then
      `aws s3 sync dist/ s3://<bucket> --delete`.
- [ ] After sync, `aws cloudfront create-invalidation --paths "/*"` runs against the distribution.
- [ ] The bucket name and distribution ID are read from GitHub secrets/vars, not hardcoded.

### FR-007: The Cypress e2e gate is preserved in GitHub Actions

#### Description:

The end-to-end coverage that Netlify used to run before deploy now runs in CI.

#### Acceptance Criteria:

- [ ] `ci.yml` runs the Cypress e2e suite (`npm run e2e`) against a locally served production build, on
      `pull_request` and on `push` to `main`.
- [ ] A failing e2e run fails the workflow (red check).
- [ ] The README documents enabling branch protection so the e2e check is required before merge to `main`.

### FR-008: Netlify is retired from the repo

#### Description:

Repo docs no longer present Netlify as the host; the manual disconnect is documented.

#### Acceptance Criteria:

- [ ] `README.md`, `CLAUDE.md` (Tech Stack → Hosting), and `docs/architecture.md` describe S3 + CloudFront
      hosting and the OIDC deploy flow.
- [ ] The maintainer step to disconnect the Netlify site / GitHub app (so its PR checks stop) is documented.
- [ ] `grep -ri netlify` over tracked files returns only historical/changelog mentions, not active config.

---

## Data Model

Not applicable — this spec provisions infrastructure and CI, not application data.

## API / Interface Contract

OpenTofu outputs (root, surfaced from the `app`/`base` modules) consumed by CI and setup:

```
static_assets_bucket_name   -> S3 bucket for the built SPA
cloudfront_distribution_id  -> for cache invalidation
cloudfront_domain_name      -> public site URL (default CloudFront domain)
deploy_role_arn             -> assumed by GitHub Actions via OIDC
```

## Configuration / Environment

Required GitHub configuration (mirrors the reference; no `VITE_*` build vars needed — the app has no
backend):

- **Secrets:** `AWS_DEPLOY_ROLE_ARN`, `S3_STATIC_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`,
  `TF_VAR_state_bucket`, `TF_VAR_state_lock_table`.
- **Variables:** `AWS_REGION` (e.g. `us-east-1`), `TF_VAR_github_repo` (`agriffi10/word-game-clone`).
- Suggested OpenTofu values: `project_name = "wordgame"`, `environment = "prod"`.

## File & Folder Structure

```
infra/
├── backend.tf
├── providers.tf
├── variables.tf
├── main.tf
├── outputs.tf
├── bootstrap/
│   ├── README.md
│   └── backend.conf.example
└── modules/
    ├── base/            # OIDC provider + deploy role
    │   ├── iam.tf
    │   ├── variables.tf
    │   └── outputs.tf
    └── app/             # S3 static bucket + CloudFront (OAC, SPA routing)
        ├── s3.tf
        ├── cloudfront.tf
        ├── variables.tf
        └── outputs.tf
.github/workflows/
├── deploy-infra.yml     # plan on PR, apply on main (OIDC)
├── deploy-app.yml       # build + sync + invalidate on main (OIDC)
└── ci.yml               # + Cypress e2e job (PR + push main)
```

## Implementation Phases

### Phase 1: OpenTofu infrastructure

- Scaffold the `infra/` root (`providers`, `backend`, `variables`, `main`, `outputs`) and the `base` +
  `app` modules per the reference conventions.
- Write `infra/bootstrap/` (README + `backend.conf.example`) and update `.gitignore`.
- Verify locally with `tofu fmt -check`, `tofu init -backend-config=…`, `tofu validate`, `tofu plan`.

### Phase 2: CI/CD workflows

- Add `deploy-infra.yml` (plan on PR / apply on main, OIDC) and `deploy-app.yml` (build → sync →
  invalidate on main, OIDC).
- Add the Cypress e2e job to `ci.yml` (PR + push main) against a served build.

### Phase 3: Cutover & retire Netlify

- Perform the first local `apply` (bootstrap), wire the GitHub secrets/vars, and confirm a push to `main`
  deploys and serves via the CloudFront URL.
- Update README / CLAUDE / architecture to the new hosting model; document the manual Netlify disconnect.
- Completion ritual: delivery doc + `CLAUDE.md` Key Decisions (hosting = S3+CloudFront via OpenTofu) and
  a `component-inventory.md` row for the reusable `app`/`base` OpenTofu modules.
