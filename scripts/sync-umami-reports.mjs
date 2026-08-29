import { readFile } from "node:fs/promises";
import { authenticateUmami, syncUmamiReports } from "../src/server/umami-admin.mjs";

const config = JSON.parse(await readFile(new URL("../config/umami-reports.v1.json", import.meta.url), "utf8"));
const baseUrl = process.env.UMAMI_BASE_URL ?? "https://analytics.contextter.com";
const token = await authenticateUmami({
  baseUrl,
  apiToken: process.env.UMAMI_API_TOKEN,
  username: process.env.UMAMI_USERNAME,
  password: process.env.UMAMI_PASSWORD,
});
const results = await syncUmamiReports({ baseUrl, websiteId: config.websiteId, token, reports: config.reports });
for (const result of results) process.stdout.write(`${result.action}: ${result.name}\n`);
