import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import { removeDist, serveDist, getPageHtml } from "./handle-dist";
import { copyDir } from "./utils/file";
import { BuildHeadOptions, applyHead } from "./handle-head";
// import { applyHead, BuildHeadOptions } from "./handle-head";

const SLIDEV_DIST = "dist";
const OUT_DIR = "dist-ssg";
const PAGES = [1, 2, 3];
const PORT = 4173;

async function main() {
  await removeDist(OUT_DIR);

  await copyDir(path.join(SLIDEV_DIST, "assets"), path.join(OUT_DIR, "assets"));

  const [server, origin] = await serveDist(SLIDEV_DIST, PORT);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    for (const n of PAGES) {
      console.log(`[SSG] page ${n}`);
      const originalHtml = await getPageHtml(page, `${origin}/${n}`);

      const head: BuildHeadOptions = {
        title: `ページ${n}`,
        seoMeta: {
          ogTitle: `ページ${n}`,
          ogDescription: `ページ${n}です！`,
          ogImage: `assets/image-${n}`,
        },
      };
      const html = await applyHead(originalHtml, head);

      await fs.writeFile(path.join(OUT_DIR, `${n}.html`), html);
    }
  } finally {
    await browser.close();
    server.kill();
  }

  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
