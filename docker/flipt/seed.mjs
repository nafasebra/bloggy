import { readFile } from "node:fs/promises";
import { setTimeout } from "node:timers/promises";

// Create once; never overwrite a value changed through the dashboard.
const base = (process.env.FLIPT_URL || "http://flipt:8080").replace(/\/$/, "");
const resource = "/api/v2/environments/default/namespaces/default/resources";
const flag = JSON.parse(
  await readFile(new URL("./test-flag.json", import.meta.url), "utf8"),
);

for (let attempt = 0; attempt < 30; attempt++) {
  try {
    const namespaceUrl = `${base}/api/v2/environments/default/namespaces/default`;
    const namespace = await fetch(namespaceUrl, {
      signal: AbortSignal.timeout(2000),
    });
    if (namespace.status === 404) {
      const createdNamespace = await fetch(
        `${base}/api/v2/environments/default/namespaces`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "default", name: "Default" }),
          signal: AbortSignal.timeout(2000),
        },
      );
      if (!createdNamespace.ok && createdNamespace.status !== 409) {
        throw new Error(`Create namespace returned ${createdNamespace.status}`);
      }
    } else if (!namespace.ok) {
      throw new Error(`Read namespace returned ${namespace.status}`);
    }
    const existing = await fetch(
      `${base}${resource}/flipt.core.Flag/${flag.key}`,
      {
        signal: AbortSignal.timeout(2000),
      },
    );
    if (existing.ok) {
      console.log("Test flag already exists; preserving its configuration.");
      process.exit(0);
    }
    if (existing.status === 404) {
      const created = await fetch(`${base}${resource}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flag),
        signal: AbortSignal.timeout(2000),
      });
      if (created.ok || created.status === 409) {
        console.log("Test flag is ready.");
        process.exit(0);
      }
      throw new Error(
        `Create flag returned ${created.status}: ${await created.text()}`,
      );
    }
    throw new Error(`Read flag returned ${existing.status}`);
  } catch (error) {
    if (attempt === 29) throw error;
    await setTimeout(1000);
  }
}
