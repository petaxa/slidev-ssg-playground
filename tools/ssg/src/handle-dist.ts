import fs from "node:fs/promises";
import { ChildProcess, spawn } from "node:child_process";
import { Page } from "@playwright/test";


export async function removeDist(outDir: string): Promise<void> {
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
export async function serveDist(
  distPath: string,
  port: number
): Promise<[ChildProcess, string]> {
  const server = spawn("npx", ["serve", distPath, "-p", String(port)], {
    stdio: "inherit",
  });
  await wait(800);

  const origin = `http://localhost:${port}`;
  return [server, origin];
}

export async function getPageHtml(
  page: Page,
  pageUrl: string
): Promise<string> {
  await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
  await wait(300);
  await page.evaluate(async () => {
    if (document.fonts) await document.fonts.ready;
  });

  const html = await page.evaluate(
    () => "<!doctype html>\n" + document.documentElement.outerHTML
  );
  return html;
}
