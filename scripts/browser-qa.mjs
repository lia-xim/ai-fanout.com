import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const previewUrl = process.env.PREVIEW_URL ?? "http://127.0.0.1:4322";
const screenshotDir = process.env.QA_SCREENSHOT_DIR;
const runLabel = process.env.QA_RUN_LABEL ?? (previewUrl.includes("127.0.0.1") ? "local" : "live");
const debugPort = 9339;
const profile = await mkdtemp(join(tmpdir(), "ai-fanout-browser-qa-"));
const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  `--remote-debugging-port=${debugPort}`,
  "--remote-allow-origins=*",
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: "ignore", windowsHide: true });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const endpoint = `http://127.0.0.1:${debugPort}`;

async function waitForChrome() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`${endpoint}/json/version`);
      if (response.ok) return;
    } catch {}
    if (chrome.exitCode !== null) throw new Error(`Chrome exited before DevTools was ready: ${chrome.exitCode}`);
    await delay(100);
  }
  throw new Error("Chrome DevTools endpoint did not become ready");
}

class CdpSession {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.nextId = 1;
    this.pending = new Map();
    this.events = new Map();
  }

  async ready() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      const handlers = this.events.get(message.method) ?? [];
      for (const handler of handlers) handler(message.params);
    });
  }

  on(method, handler) {
    const handlers = this.events.get(method) ?? [];
    handlers.push(handler);
    this.events.set(method, handlers);
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text ?? "Runtime evaluation failed");
    return result.result.value;
  }

  close() { this.socket.close(); }
}

async function createSession() {
  const response = await fetch(`${endpoint}/json/new?about:blank`, { method: "PUT" });
  if (!response.ok) throw new Error(`Unable to create Chrome target: ${response.status}`);
  const target = await response.json();
  const session = new CdpSession(target.webSocketDebuggerUrl);
  await session.ready();
  await Promise.all([session.send("Page.enable"), session.send("Runtime.enable"), session.send("Log.enable")]);
  return session;
}

async function navigate(session, url) {
  const loaded = new Promise((resolve) => {
    const handler = () => resolve();
    session.on("Page.loadEventFired", handler);
  });
  await session.send("Page.navigate", { url });
  await Promise.race([loaded, delay(5000).then(() => { throw new Error(`Timed out loading ${url}`); })]);
  await delay(150);
}

async function screenshot(session, name) {
  if (!screenshotDir) return;
  await mkdir(screenshotDir, { recursive: true });
  const result = await session.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
  await writeFile(join(screenshotDir, `${runLabel}-${name}.png`), Buffer.from(result.data, "base64"));
}
await waitForChrome();
const session = await createSession();
const consoleProblems = [];
session.on("Runtime.exceptionThrown", (event) => consoleProblems.push(`exception: ${event.exceptionDetails?.text ?? "unknown"}`));
session.on("Log.entryAdded", ({ entry }) => {
  if (["error", "warning"].includes(entry.level)) consoleProblems.push(`${entry.level}: ${entry.text}`);
});
session.on("Runtime.consoleAPICalled", (event) => {
  if (["error", "warning"].includes(event.type)) consoleProblems.push(`${event.type}: console call`);
});

const results = {};
try {
  await session.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await navigate(session, `${previewUrl}/`);
  results.home = await session.evaluate(`(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    overflow: document.documentElement.scrollWidth > innerWidth,
    h1: document.querySelector('h1')?.textContent?.trim(),
    plannerPresent: Boolean(document.querySelector('[data-fanout-planner]')),
    plannerDisabled: document.querySelector('[data-planner-form] button')?.disabled,
    robots: document.querySelector('meta[name="robots"]')?.content ?? null,
    primaryAction: document.querySelector('.planner-hero .button')?.getAttribute('href')
  }))()`);
  await screenshot(session, "home-desktop");

  await navigate(session, `${previewUrl}/lab`);
  results.lab = await session.evaluate(`(() => {
    document.querySelector('[data-load-sample]')?.click();
    document.querySelector('[data-lab-form]')?.requestSubmit();
    const metric = (name) => document.querySelector('[data-metric="' + name + '"]')?.textContent?.trim();
    return {
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      h1: document.querySelector('h1')?.textContent?.trim(),
      robots: document.querySelector('meta[name="robots"]')?.content ?? null,
      observations: document.querySelectorAll('[data-observation-stack] [data-observation]').length,
      resultsVisible: !document.querySelector('[data-lab-results]')?.hidden,
      observationMetric: metric('observations'),
      domainMetric: metric('domains'),
      recurringMetric: metric('recurring'),
      coverageMetric: metric('coverage'),
      overlapMetric: metric('overlap'),
      sourceRows: document.querySelectorAll('[data-source-matrix] tbody tr').length,
      coverageRows: document.querySelectorAll('[data-coverage-matrix] tbody tr').length,
      warnings: document.querySelectorAll('[data-warning-list] li').length,
      localOnly: document.querySelector('.privacy-mark strong')?.textContent?.trim()
    };
  })()`);
  await delay(250);
  await session.evaluate(`(() => { document.documentElement.style.scrollBehavior = 'auto'; document.querySelector('[data-lab-results]')?.scrollIntoView({ block: 'start' }); })()`);
  await screenshot(session, "lab-desktop");

  await navigate(session, `${previewUrl}/library`);
  results.library = await session.evaluate(`(() => {
    document.querySelector('[data-filter="Method"]')?.click();
    const items = [...document.querySelectorAll('[data-library-item]')];
    return {
      references: items.length,
      filters: document.querySelectorAll('[data-filter]').length,
      pressed: document.querySelector('[data-filter="Method"]')?.getAttribute('aria-pressed'),
      visible: items.filter((item) => !item.hidden).length,
      hidden: items.filter((item) => item.hidden).length
    };
  })()`);

  await session.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await navigate(session, `${previewUrl}/protocol-builder`);
  results.protocol = await session.evaluate(`(() => {
    document.querySelector('.mobile-nav summary')?.click();
    document.querySelector('[data-load-protocol-sample]')?.click();
    document.querySelector('[data-protocol-form]')?.requestSubmit();
    const readiness = [...document.querySelectorAll('[data-protocol-readiness] li')];
    return {
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      h1: document.querySelector('h1')?.textContent?.trim(),
      robots: document.querySelector('meta[name="robots"]')?.content ?? null,
      menuOpen: document.querySelector('.mobile-nav')?.hasAttribute('open'),
      resultsVisible: !document.querySelector('[data-protocol-result]')?.hidden,
      readinessSignals: readiness.length,
      readySignals: readiness.filter((item) => item.classList.contains('is-ready')).length,
      previewHasName: document.querySelector('[data-protocol-preview]')?.textContent?.includes('Monthly public answer-source control set'),
      exportButtons: document.querySelectorAll('[data-protocol-result] button').length
    };
  })()`);
  await delay(250);
  await session.evaluate(`(() => { document.documentElement.style.scrollBehavior = 'auto'; document.querySelector('.mobile-nav summary')?.click(); document.querySelector('[data-protocol-result]')?.scrollIntoView({ block: 'start' }); })()`);
  await screenshot(session, "protocol-mobile");

  const failed = [];
  if (results.home.overflow || results.lab.overflow || results.protocol.overflow) failed.push("horizontal overflow detected");
  if (results.home.robots !== null || results.lab.robots !== null || results.protocol.robots !== null) failed.push("global meta noindex still present");
  if (results.home.h1 !== "One question.Its useful edges." || !results.home.plannerPresent || !results.home.plannerDisabled || results.home.primaryAction !== "#planner") failed.push("homepage composition failed");
  if (results.lab.h1 !== "Compare what the answers show." || results.lab.observations !== 3 || !results.lab.resultsVisible) failed.push("lab demo interaction failed");
  if (results.lab.observationMetric !== "3" || results.lab.domainMetric !== "3" || results.lab.recurringMetric !== "2 / 3" || results.lab.coverageMetric !== "12 / 12") failed.push("lab measure contract failed");
  if (!/%$/.test(results.lab.overlapMetric ?? "") || results.lab.sourceRows !== 3 || results.lab.coverageRows !== 4 || results.lab.warnings < 3 || results.lab.localOnly !== "Local only") failed.push("lab output rendering failed");
  if (results.library.references !== 13 || results.library.filters < 6 || results.library.pressed !== "true" || results.library.visible !== 4 || results.library.hidden !== 9) failed.push("library filter interaction failed");
  if (results.protocol.h1 !== "Fix the method before the first run." || !results.protocol.menuOpen || !results.protocol.resultsVisible) failed.push("mobile protocol interaction failed");
  if (results.protocol.readinessSignals !== 8 || results.protocol.readySignals !== 5 || !results.protocol.previewHasName || results.protocol.exportButtons !== 2) failed.push("protocol output contract failed");
  if (consoleProblems.length) failed.push(...consoleProblems);
  if (failed.length) throw new Error(failed.join("; "));
  console.log(JSON.stringify({ status: "passed", previewUrl, screenshotDir: screenshotDir ?? null, ...results, consoleProblems }, null, 2));
} finally {
  session.close();
  chrome.kill();
  await delay(200);
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
