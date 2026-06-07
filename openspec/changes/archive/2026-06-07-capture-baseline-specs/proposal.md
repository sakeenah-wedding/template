## Why

OpenSpec is empty (`openspec/specs/` has no capabilities), so there is no documented contract to diff future changes against. The invitation and wishes APIs already exist, are tested, and are in production, but their required behavior lives only in code and tests. Capturing the current behavior as baseline specs gives every future change a stable reference point and makes regressions reviewable at the spec level.

## What Changes

- Document the **existing, shipped** behavior of the invitation read API as a spec — no behavior change.
- Document the **existing, shipped** behavior of the wishes/RSVP API (list, create with one-wish-per-guest dedup, delete, check-by-name, attendance stats) as a spec — no behavior change.
- Reflect current validation rules exactly as implemented (UID format, wish field limits, attendance enum, pagination bounds).
- Explicitly record known current characteristics as written (e.g. delete and stats are unauthenticated, guest identity is the plaintext `name`) so later hardening changes can show up as deliberate `MODIFIED`/`REMOVED` deltas rather than silent drift.

This is a documentation/capture change. It introduces no code edits and no migrations.

Non-goals: changing any endpoint behavior, adding auth, or altering validation. Those are separate proposals (e.g. the DB connection fix and future auth work).

## Capabilities

### New Capabilities
- `invitation-api`: Fetching a wedding invitation by UID, including its agenda items and bank accounts, with UID validation and not-found handling.
- `wishes-api`: Guest wishes and RSVP management for an invitation — listing with pagination, creating with one-wish-per-guest enforcement, deletion by id, checking whether a guest has submitted, and attendance statistics.

### Modified Capabilities
<!-- None: this change introduces baseline specs only; no existing spec exists to modify. -->

## Impact

- **Specs**: adds `openspec/specs/invitation-api/` and `openspec/specs/wishes-api/` once archived.
- **Code**: none. This captures behavior already present in `src/server/features/invitation/` and `src/server/features/wishes/` plus the `/:uid/stats` route in `src/server/index.js`.
- **Tests**: none added; existing `routes.spec.js` and `api.e2e.spec.js` already exercise this behavior and serve as the executable counterpart to these specs.
- **Future changes**: establishes the diff baseline so auth, tenant isolation, and CORS changes can be expressed as explicit spec deltas.
