## ADDED Requirements

### Requirement: Database client resolution

The server SHALL provide a `getDbClient(context)` helper that returns a database client exposing an async `query(sql, params)` method. The helper SHALL resolve the connection source in the following priority order:

1. A Cloudflare Hyperdrive binding available at `context.env.DB`.
2. A `DATABASE_URL` connection string available at `context.env.DATABASE_URL`.

The returned client's `query` method SHALL accept a SQL string and an optional array of bind parameters and resolve to a result object containing a `rows` array, matching the existing consumer expectations in the invitation, wishes, and stats routes.

#### Scenario: Hyperdrive binding is available

- **WHEN** `getDbClient` is called with a context whose `env.DB` provides a Hyperdrive connection string
- **THEN** the helper returns a client whose `query` method executes against the Hyperdrive connection
- **AND** consumers can call `.query(sql, params)` and receive a result with a `rows` array

#### Scenario: DATABASE_URL fallback is available

- **WHEN** `getDbClient` is called with a context that has no `env.DB` but provides `env.DATABASE_URL`
- **THEN** the helper returns a client backed by a pool created from `DATABASE_URL`
- **AND** consumers can call `.query(sql, params)` and receive a result with a `rows` array

#### Scenario: No connection source is configured

- **WHEN** `getDbClient` is called with a context that has neither `env.DB` nor `env.DATABASE_URL`
- **THEN** the helper throws an error whose message explains that a Hyperdrive binding or `DATABASE_URL` must be configured

### Requirement: Connection pool reuse

The server SHALL reuse a single database connection pool per connection source within a runtime instance, rather than creating a new pool on each request. Repeated calls to `getDbClient` that resolve to the same connection source SHALL return clients backed by the same underlying pool.

#### Scenario: Repeated requests reuse the pool

- **WHEN** `getDbClient` is called multiple times within the same runtime instance with the same connection source
- **THEN** the underlying connection pool is created at most once
- **AND** no additional pools are constructed for subsequent calls

#### Scenario: Pool is created lazily

- **WHEN** the module is loaded but `getDbClient` has not yet been called
- **THEN** no connection pool is constructed
- **AND** the pool is created only on the first call that requires it
