# invitation-api Specification

## Purpose
TBD - created by archiving change capture-baseline-specs. Update Purpose after archive.
## Requirements
### Requirement: Fetch invitation by UID

The system SHALL expose `GET /api/invitation/:uid` that returns a single wedding invitation identified by its UID, together with its agenda items and bank accounts.

The response SHALL be JSON of the form `{ success: true, data: {...} }` where `data` maps database columns to the frontend's camelCase config structure, including `title`, `description`, `groomName`, `brideName`, `parentGroom`, `parentBride`, `date`, `time`, `location`, `address`, `maps_url`, `maps_embed`, `ogImage`, `favicon`, `audio`, an `agenda` array, and a `banks` array.

Each `agenda` item SHALL contain `title`, `date`, `startTime`, `endTime`, `location`, and `address`, ordered by `order_index` then `date`. Each `banks` item SHALL contain `bank`, `accountNumber`, and `accountName`, ordered by `order_index`.

#### Scenario: Invitation exists with agenda and banks

- **WHEN** a client requests `GET /api/invitation/:uid` for an existing invitation
- **THEN** the response status is 200
- **AND** `data` contains the invitation fields in camelCase
- **AND** `data.agenda` and `data.banks` contain the related rows in their defined order

#### Scenario: Invitation has no agenda or banks

- **WHEN** a client requests an existing invitation that has no agenda items and no bank accounts
- **THEN** the response status is 200
- **AND** `data.agenda` is an empty array
- **AND** `data.banks` is an empty array

#### Scenario: Invitation does not exist

- **WHEN** a client requests `GET /api/invitation/:uid` for a UID with no matching invitation
- **THEN** the response status is 404
- **AND** the body is `{ success: false, error: "Invitation not found" }`

### Requirement: UID format validation

The system SHALL validate the `:uid` path parameter before querying. A valid UID is a non-empty string of at most 100 characters containing only lowercase letters, digits, and hyphens (`^[a-z0-9-]+$`).

#### Scenario: UID violates the allowed format

- **WHEN** a client requests an invitation with a UID containing uppercase letters or disallowed characters
- **THEN** the response status is 400
- **AND** no invitation query is executed

### Requirement: Invitation read errors are not leaked

The system SHALL handle unexpected database errors during invitation retrieval without exposing internal details.

#### Scenario: Database query fails

- **WHEN** the database query throws during an invitation request
- **THEN** the response status is 500
- **AND** the body is `{ success: false, error: "Internal server error" }`

