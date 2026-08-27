import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const previewUrl = process.env.PREVIEW_URL ?? "http://127.0.0.1:4322";
const screenshotDir = process.env.QA_SCREENSHOT_DIR;
const debugPort = 9341;
const profile = await mkdtemp(join(tmpdir(), "ai-fanout-article-qa-"));
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
      for (const handler of this.events.get(message.method) ?? []) handler(message.params);
    });
  }

  on(method, handler) {
    this.events.set(method, [...(this.events.get(method) ?? []), handler]);
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

async function waitForChrome() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`${endpoint}/json/version`);
      if (response.ok) return;
    } catch {}
    await delay(100);
  }
  throw new Error("Chrome DevTools endpoint did not become ready");
}

async function createSession() {
  const response = await fetch(`${endpoint}/json/new?about:blank`, { method: "PUT" });
  const target = await response.json();
  const session = new CdpSession(target.webSocketDebuggerUrl);
  await session.ready();
  await Promise.all([session.send("Page.enable"), session.send("Runtime.enable"), session.send("Log.enable")]);
  return session;
}

async function inspect(session, width, height, mobile, label) {
  await session.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
  const loaded = new Promise((resolve) => session.on("Page.loadEventFired", resolve));
  await session.send("Page.navigate", { url: `${previewUrl}/de/lernen/ki-modelle-vergleichen` });
  await Promise.race([loaded, delay(5000).then(() => { throw new Error("Article load timed out"); })]);
  await delay(300);
  const result = await session.evaluate(`(() => ({
    h1: document.querySelector('h1')?.textContent?.trim(),
    h1Size: parseFloat(getComputedStyle(document.querySelector('h1')).fontSize),
    h2Sizes: [...document.querySelectorAll('.article-chapter h2')].map((el) => parseFloat(getComputedStyle(el).fontSize)),
    chapters: document.querySelectorAll('.article-chapter').length,
    paragraphs: document.querySelectorAll('.article-chapter p').length,
    sources: document.querySelectorAll('.source-notes li').length,
    tocLinks: document.querySelectorAll('.article-toc nav a').length,
    heroImage: Boolean(document.querySelector('.editorial-hero-image')),
    legacyMarkers: document.querySelectorAll('.section-label, .article-code, .article-visual').length,
    overflow: document.documentElement.scrollWidth > innerWidth,
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth
  }))()`);
  if (screenshotDir) {
    await mkdir(screenshotDir, { recursive: true });
    const shot = await session.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
    await writeFile(join(screenshotDir, `${label}.png`), Buffer.from(shot.data, "base64"));
  }
  return result;
}

async function inspectHome(session, width, height, mobile, label) {
  await session.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
  const loaded = new Promise((resolve) => session.on("Page.loadEventFired", resolve));
  await session.send("Page.navigate", { url: `${previewUrl}/` });
  await Promise.race([loaded, delay(5000).then(() => { throw new Error("Homepage load timed out"); })]);
  await delay(300);
  const result = await session.evaluate(`(() => ({
    h1: document.querySelector('h1')?.textContent?.trim(),
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content,
    ogTitle: document.querySelector('meta[property="og:title"]')?.content,
    schemaFree: [...document.querySelectorAll('script[type="application/ld+json"]')].some((node) => node.textContent.includes('"isAccessibleForFree":true')),
    overflow: document.documentElement.scrollWidth > innerWidth,
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth
  }))()`);
  if (screenshotDir) {
    await mkdir(screenshotDir, { recursive: true });
    const shot = await session.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
    await writeFile(join(screenshotDir, `${label}.png`), Buffer.from(shot.data, "base64"));
  }
  return result;
}

await waitForChrome();
const session = await createSession();
const consoleProblems = [];
session.on("Runtime.exceptionThrown", (event) => consoleProblems.push(event.exceptionDetails?.text ?? "runtime exception"));
session.on("Log.entryAdded", ({ entry }) => {
  if (entry.level === "error") consoleProblems.push(entry.text);
});

try {
  const desktop = await inspect(session, 1440, 1000, false, "article-desktop");
  const mobile = await inspect(session, 390, 844, true, "article-mobile");
  const homeDesktop = await inspectHome(session, 1440, 1000, false, "home-seo-desktop");
  const homeMobile = await inspectHome(session, 390, 844, true, "home-seo-mobile");
  const failures = [];
  for (const [label, result] of [["desktop", desktop], ["mobile", mobile]]) {
    if (result.h1 !== "Wie vergleicht man OpenAI und Gemini Fanout?") failures.push(`${label}: wrong H1`);
    if (result.chapters !== 2 || result.paragraphs < 8) failures.push(`${label}: article is still fragmented or thin`);
    if (result.sources < 4 || result.tocLinks !== result.chapters) failures.push(`${label}: sources or TOC missing`);
    if (!result.heroImage || result.legacyMarkers !== 0) failures.push(`${label}: editorial composition failed`);
    if (result.overflow) failures.push(`${label}: horizontal overflow (${result.scrollWidth}/${result.width})`);
  }
  if (desktop.h1Size > 90 || desktop.h2Sizes.some((size) => size > 48)) failures.push("desktop: headings are oversized");
  if (mobile.h1Size > 54 || mobile.h2Sizes.some((size) => size > 40)) failures.push("mobile: headings are oversized");
  for (const [label, result] of [["home desktop", homeDesktop], ["home mobile", homeMobile]]) {
    if (result.h1 !== "Free AI Query Fanout Tool") failures.push(`${label}: free-tool H1 missing`);
    if (result.title !== "Free AI Fanout Tool for OpenAI & Gemini — ai-fanout.com") failures.push(`${label}: SEO title mismatch`);
    if (!result.description?.includes("free AI query fanout tool") || result.ogTitle !== result.title || !result.schemaFree) failures.push(`${label}: metadata mismatch`);
    if (result.overflow) failures.push(`${label}: horizontal overflow (${result.scrollWidth}/${result.width})`);
  }
  if (consoleProblems.length) failures.push(`browser errors: ${consoleProblems.join(" | ")}`);
  console.log(JSON.stringify({ desktop, mobile, homeDesktop, homeMobile, consoleProblems }, null, 2));
  if (failures.length) throw new Error(failures.join("\n"));
  console.log("Article browser QA passed.");
} finally {
  session.close();
  chrome.kill();
  await delay(500);
  try { await rm(profile, { recursive: true, force: true, maxRetries: 4, retryDelay: 250 }); } catch {}
}
