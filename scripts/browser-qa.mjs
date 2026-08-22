import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const previewUrl = process.env.PREVIEW_URL ?? "http://127.0.0.1:4322";
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
  await navigate(session, `${previewUrl}/library`);
  results.desktop = await session.evaluate(`(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    overflow: document.documentElement.scrollWidth > innerWidth,
    title: document.title,
    h1: document.querySelector('h1')?.textContent?.trim(),
    references: document.querySelectorAll('[data-library-item]').length,
    filters: document.querySelectorAll('[data-filter]').length,
    currentNav: document.querySelector('.desktop-nav [aria-current="page"]')?.textContent?.trim()
  }))()`);
  results.filter = await session.evaluate(`(() => {
    document.querySelector('[data-filter="Method"]')?.click();
    const items = [...document.querySelectorAll('[data-library-item]')];
    return {
      pressed: document.querySelector('[data-filter="Method"]')?.getAttribute('aria-pressed'),
      visible: items.filter((item) => !item.hidden).length,
      hidden: items.filter((item) => item.hidden).length
    };
  })()`);

  await session.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await navigate(session, `${previewUrl}/library/query-fan-out`);
  results.mobile = await session.evaluate(`(() => {
    document.querySelector('.mobile-nav summary')?.click();
    return {
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      h1: document.querySelector('h1')?.textContent?.trim(),
      sections: document.querySelectorAll('.article-section').length,
      sources: document.querySelectorAll('.source-notes li').length,
      menuOpen: document.querySelector('.mobile-nav')?.hasAttribute('open'),
      directAnswer: Boolean(document.querySelector('.direct-answer')),
      breadcrumb: document.querySelector('.breadcrumb')?.textContent?.replace(/\\s+/g, ' ').trim()
    };
  })()`);

  const failed = [];
  if (results.desktop.overflow || results.mobile.overflow) failed.push("horizontal overflow detected");
  if (results.desktop.references !== 13 || results.desktop.filters < 6) failed.push("library index count failed");
  if (results.filter.pressed !== "true" || results.filter.visible !== 4 || results.filter.hidden !== 9) failed.push("library filter interaction failed");
  if (results.mobile.sections < 4 || results.mobile.sources < 2 || !results.mobile.menuOpen || !results.mobile.directAnswer) failed.push("mobile article or menu contract failed");
  if (consoleProblems.length) failed.push(...consoleProblems);
  if (failed.length) throw new Error(failed.join("; "));
  console.log(JSON.stringify({ status: "passed", previewUrl, ...results, consoleProblems }, null, 2));
} finally {
  session.close();
  chrome.kill();
  await delay(200);
  await rm(profile, { recursive: true, force: true });
}
