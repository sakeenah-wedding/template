/**
 * Unit tests for the database connection helper.
 *
 * `pg` is mocked so we can assert pool construction behavior (lazy creation and
 * per-connection-string reuse) without a real database.
 *
 * NOTE: `getDbClient` uses a module-scoped pool cache that persists for the
 * lifetime of the module. Each test therefore uses a DISTINCT connection string
 * to avoid cross-test cache pollution.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock pg with a constructor spy so we can count Pool instantiations.
const poolInstances = [];
const PoolMock = vi.fn(function Pool(config) {
  const instance = {
    config,
    query: vi.fn(async () => ({ rows: [] })),
  };
  poolInstances.push(instance);
  return instance;
});

vi.mock("pg", () => ({
  default: { Pool: PoolMock },
  Pool: PoolMock,
}));

import { getDbClient } from "./db-client.js";

/** Build a Hono-like context with the given env. */
function ctx(env) {
  return { env };
}

describe("getDbClient", () => {
  beforeEach(() => {
    PoolMock.mockClear();
    poolInstances.length = 0;
  });

  it("builds a client from a Hyperdrive binding connectionString", async () => {
    const connectionString = "postgres://hyperdrive-1/db";
    const client = await getDbClient(ctx({ DB: { connectionString } }));

    expect(PoolMock).toHaveBeenCalledTimes(1);
    expect(PoolMock).toHaveBeenCalledWith({ connectionString });
    expect(typeof client.query).toBe("function");

    const result = await client.query("SELECT 1");
    expect(result).toHaveProperty("rows");
  });

  it("accepts a Hyperdrive binding that is itself a connection string", async () => {
    const connectionString = "postgres://hyperdrive-string/db";
    const client = await getDbClient(ctx({ DB: connectionString }));

    expect(PoolMock).toHaveBeenCalledTimes(1);
    expect(PoolMock).toHaveBeenCalledWith({ connectionString });
    expect(typeof client.query).toBe("function");
  });

  it("falls back to DATABASE_URL when no DB binding is present", async () => {
    const connectionString = "postgres://database-url/db";
    const client = await getDbClient(ctx({ DATABASE_URL: connectionString }));

    expect(PoolMock).toHaveBeenCalledTimes(1);
    expect(PoolMock).toHaveBeenCalledWith({ connectionString });
    expect(typeof client.query).toBe("function");
  });

  it("reuses the same pool across repeated calls for the same connection string", async () => {
    const connectionString = "postgres://reuse-me/db";
    const c = ctx({ DATABASE_URL: connectionString });

    const first = await getDbClient(c);
    const second = await getDbClient(c);
    const third = await getDbClient(ctx({ DATABASE_URL: connectionString }));

    // Pool constructed at most once despite three calls.
    expect(PoolMock).toHaveBeenCalledTimes(1);
    expect(first).toBe(second);
    expect(second).toBe(third);
  });

  it("throws a clear error when no connection source is configured", async () => {
    await expect(getDbClient(ctx({}))).rejects.toThrow(
      /Hyperdrive binding.*DATABASE_URL/i,
    );
    expect(PoolMock).not.toHaveBeenCalled();
  });

  it("throws when context has no env at all", async () => {
    await expect(getDbClient({})).rejects.toThrow(/DATABASE_URL/i);
    expect(PoolMock).not.toHaveBeenCalled();
  });
});
