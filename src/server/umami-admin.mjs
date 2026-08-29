const trimBase = value => String(value ?? "").replace(/\/$/, "");

async function expectJson(response, label) {
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { throw new Error(`${label} returned invalid JSON (${response.status})`); }
  if (!response.ok) throw new Error(`${label} failed (${response.status})`);
  return data;
}

export async function authenticateUmami({ baseUrl, apiToken, username, password, fetchImpl = fetch }) {
  if (apiToken) return apiToken;
  if (!username || !password) throw new Error("Set UMAMI_API_TOKEN or both UMAMI_USERNAME and UMAMI_PASSWORD.");
  const response = await fetchImpl(`${trimBase(baseUrl)}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await expectJson(response, "Umami login");
  if (!data.token) throw new Error("Umami login returned no token.");
  return data.token;
}

export async function syncUmamiReports({ baseUrl, websiteId, token, reports, fetchImpl = fetch }) {
  if (!websiteId || !token || !Array.isArray(reports)) throw new Error("Missing Umami sync configuration.");
  const base = trimBase(baseUrl);
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const listing = await expectJson(await fetchImpl(`${base}/api/reports?websiteId=${encodeURIComponent(websiteId)}&pageSize=100`, { headers }), "Umami report listing");
  const existing = Array.isArray(listing.data) ? listing.data : [];
  const results = [];
  for (const report of reports) {
    const match = existing.find(item => item.name === report.name && item.type === report.type);
    const body = JSON.stringify({ ...report, websiteId });
    const url = match ? `${base}/api/reports/${encodeURIComponent(match.id)}` : `${base}/api/reports`;
    const saved = await expectJson(await fetchImpl(url, { method: "POST", headers, body }), `Umami report ${report.name}`);
    results.push({ name: report.name, action: match ? "updated" : "created", id: saved.id ?? match?.id ?? null });
  }
  return results;
}

export async function resetUmamiWebsite({ baseUrl, websiteId, token, confirmation, fetchImpl = fetch }) {
  if (!websiteId || confirmation !== websiteId) throw new Error("Exact website ID confirmation is required.");
  const response = await fetchImpl(`${trimBase(baseUrl)}/api/websites/${encodeURIComponent(websiteId)}/reset`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  return expectJson(response, "Umami website reset");
}
