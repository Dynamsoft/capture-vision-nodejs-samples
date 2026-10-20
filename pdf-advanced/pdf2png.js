// Modify from https://github.com/mozilla/pdf.js/blob/master/examples/node/pdf2png/pdf2png.js

/* Copyright 2017 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require("path");
const { getDocument } = require("pdfjs-dist/legacy/build/pdf.mjs");

// Some PDFs need external cmaps.
const cMapUrl = path.join(
  path.dirname(require.resolve("pdfjs-dist/package.json")),
  "cmaps/"
).replaceAll('\\','/');
const cMapPacked = true;
// Where the standard fonts are located.
const standardFontDataUrl = path.join(
  path.dirname(require.resolve("pdfjs-dist/package.json")),
  "standard_fonts/"
).replaceAll('\\','/');

const pdf2png = async function* (data) {
    const loadingTask = getDocument({
        data,
        cMapUrl,
        cMapPacked,
        standardFontDataUrl,
    });
    const pdfDocument = await loadingTask.promise;

    try {
        for (let i = 0; i < pdfDocument.numPages; ++i) {
            const page = await pdfDocument.getPage(i + 1);
            const canvasFactory = pdfDocument.canvasFactory;

            let viewport = page.getViewport({ scale: 1.0 });
            const areaInScale1 = viewport.width * viewport.height;
            if (areaInScale1 > 2048 * 2048) {
                // just use scale 1 for large image
            } else if (areaInScale1 > 1024 * 1024) {
                viewport = page.getViewport({ scale: 2.0 });
            } else {
                viewport = page.getViewport({ scale: 4.0 });
            }

            const canvasAndContext = canvasFactory.create(
                viewport.width,
                viewport.height
            );
            const renderContext = {
                canvasContext: canvasAndContext.context,
                viewport,
            };

            const renderTask = page.render(renderContext);
            await renderTask.promise;

            const img = canvasAndContext.canvas.toBuffer("image/png");

            page.cleanup();

            yield img;
        }
    } finally {
        // release all memory
        await loadingTask.destroy();
    }
};


module.exports = pdf2png;
