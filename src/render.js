/** Headless render: template HTML -> PNG / PDF. */

import { chromium } from 'playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const CSS_DPI = 96;
const PRINT_DPI = 300;

/** Blocks until webfonts and every embedded image have actually decoded. */
async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((img) =>
        img.complete ? Promise.resolve() : new Promise((res) => { img.onload = img.onerror = res; })
      )
    );
  });
}

export async function createRenderer() {
  const browser = await chromium.launch();

  return {
    /**
     * @returns {Promise<{file: string, bytes: number}[]>}
     */
    async render({ html, spec, outDir, basename }) {
      const isPrint = spec.unit === 'in';
      const viewport = isPrint
        ? { width: Math.round(spec.width * CSS_DPI), height: Math.round(spec.height * CSS_DPI) }
        : { width: spec.width, height: spec.height };

      // 96 CSS dpi * 3.125 = 300 dpi for print output.
      const deviceScaleFactor = isPrint ? PRINT_DPI / CSS_DPI : 1;

      const page = await browser.newPage({ viewport, deviceScaleFactor });
      await mkdir(outDir, { recursive: true });

      try {
        await page.setContent(html, { waitUntil: 'load' });
        await settle(page);

        const written = [];

        if (spec.outputs.includes('pdf')) {
          const file = path.join(outDir, `${basename}.pdf`);
          const buf = await page.pdf({
            width: `${spec.width}in`,
            height: `${spec.height}in`,
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
          });
          await writeFile(file, buf);
          written.push({ file, bytes: buf.length });
        }

        if (spec.outputs.includes('png')) {
          const file = path.join(outDir, `${basename}.png`);
          const buf = await page.screenshot({ type: 'png' });
          await writeFile(file, buf);
          written.push({ file, bytes: buf.length });
        }

        return written;
      } finally {
        await page.close();
      }
    },

    close: () => browser.close(),
  };
}
