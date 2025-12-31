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

const { getDocument } = require("pdfjs-dist/legacy/build/pdf.mjs");

// Some PDFs need external cmaps.
const CMAP_URL = "../../../node_modules/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;
// Where the standard fonts are located.
const STANDARD_FONT_DATA_URL =
  "../../../node_modules/pdfjs-dist/standard_fonts/";

const pdf2png = async(data)=>{
    // Load the PDF file.
    const loadingTask = getDocument({
        data,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
        //// Fonts are not necessary for barcodes
        // standardFontDataUrl: STANDARD_FONT_DATA_URL, 
    });
    const pdfDocument = await loadingTask.promise;
    const imgs = [];
    for(let i = 0; i < pdfDocument.numPages; ++i){
        // Get the first page.
        const page = await pdfDocument.getPage(i + 1);
        // Render the page on a Node canvas with 100% scale.
        const canvasFactory = pdfDocument.canvasFactory;

        // scale 1 == 72 dpi, auto change scale for different size image
        let viewport = page.getViewport({ scale: 1.0 });
        let areaInScale1 = viewport.width * viewport.height;
        if(areaInScale1 > 2048 * 2048){
            // just use scale 1 for large image
        }else if(areaInScale1 > 1024 * 1024){
            viewport = page.getViewport({ scale: 2.0 });
        }else{ 
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
        // Convert the canvas to an image buffer.
        const img = canvasAndContext.canvas.toBuffer("image/png");
        imgs.push(img);
        page.cleanup();
    }
    return imgs;
};


module.exports = pdf2png;
