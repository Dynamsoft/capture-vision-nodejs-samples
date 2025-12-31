# Use Dynamsoft Capture Vision for Node with Advanced PDF Control

This sample demonstrates how to dynamically control the DPI to prevent excessively large images from causing memory crashes during barcode decoding.

## Getting Started

**Warning**: `require('xxxxx.mjs')` in pdf2png.js needs nodejs > 22

`npm install`

`node ./index.js`

## More Optimization

For easier understanding, in this sample, the PDF file is first completely converted into multiple PNG images before performing barcode decoding.

You can rasterize the pdf one page, then decode barcodes in one page. This page by page processing allows for better control of memory usage, which is especially important for PDF files containing hundreds of pages.
