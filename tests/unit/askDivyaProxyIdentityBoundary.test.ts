import express from "express";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it } from "vitest";

/**
 * Characterization tests only: these expose Express identity semantics but
 * do NOT prove which proxy hop Render uses in production.
 */
const servers: ReturnType<typeof createServer>[] = [];

afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  })));
});

async function identityForHeaders(
  trustedProxy: boolean | number,
  headers: Record<string, string>,
): Promise<{ ip: string; ips: string[] }> {
  const app = express();
  app.set("trust proxy", trustedProxy);
  app.get("/identity", (req, res) => {
    res.json({ ip: req.ip ?? "", ips: req.ips });
  });
  const server = createServer(app);
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as AddressInfo;
  const response = await fetch(`http://127.0.0.1:${port}/identity`, { headers });
  expect(response.status).toBe(200);
  return response.json() as Promise<{ ip: string; ips: string[] }>;
}

describe("Ask Divya proxy/client-identity acceptance characterization", () => {
  it("default Express configuration ignores caller supplied X-Forwarded-For", async () => {
    const a = await identityForHeaders(false, { "X-Forwarded-For": "198.51.100.10" });
    const b = await identityForHeaders(false, { "X-Forwarded-For": "198.51.100.11" });
    expect(a.ip).toBe("127.0.0.1");
    expect(b.ip).toBe("127.0.0.1");
    expect(a.ips).toEqual([]);
    expect(b.ips).toEqual([]);
  });

  it("trusting one hop changes the derived client identity", async () => {
    const result = await identityForHeaders(1, { "X-Forwarded-For": "198.51.100.10" });
    expect(result.ip).toBe("198.51.100.10");
    expect(result.ips).toEqual(["198.51.100.10"]);
  });

  it("unvalidated trust of a forwarded header allows a direct client to choose its identity", async () => {
    const a = await identityForHeaders(1, { "X-Forwarded-For": "198.51.100.10" });
    const b = await identityForHeaders(1, { "X-Forwarded-For": "198.51.100.11" });
    expect(a.ip).not.toBe(b.ip);
  });
});
