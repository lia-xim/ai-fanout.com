import { readFile } from "node:fs/promises";
import { authenticateUmami, resetUmamiWebsite } from "../src/server/umami-admin.mjs";

const config = JSON.parse(await readFile(new URL("../config/umami-reports.v1.json", import.meta.url), "utf8"));
const confirmation = process.argv.find(value => value.startsWith("--confirm-website="))?.split("=")[1];
const baseUrl = process.env.UMAMI_BASE_URL ?? "https://analytics.contextter.com";
const token = await authenticateUmami({
  baseUrl,
  apiToken: process.env.UMAMI_API_TOKEN,
  username: process.env.UMAMI_USERNAME,
  password: process.env.UMAMI_PASSWORD,
});
await resetUmamiWebsite({ baseUrl, websiteId: config.websiteId, token, confirmation });
process.stdout.write(`reset confirmed: ${config.websiteId}\n`);
