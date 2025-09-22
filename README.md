# Dynamsoft Capture Vision for Node

This is a Node.js wrapper for [Dynamsoft Capture Vision](https://www.dynamsoft.com/capture-vision/docs/server/programming/cplusplus/), enabling you to read barcodes, recognize partial label text, capture documents, and perform other advanced vision tasks.

## Install the SDK

```sh
npm i dynamsoft-capture-vision-for-node@3.0.1007 -E
```

## Getting Started

Take barcode reading from an image as an example.

```js
const { LicenseManager, CaptureVisionRouter, EnumPresetTemplate } = require('dynamsoft-capture-vision-for-node');

// You can get your trial license from
// https://www.dynamsoft.com/customer/license/trialLicense -> Barcode Reader / Capture Vision Suite -> Desktop/Server/Embedded
// The current license is valid for only one day.
LicenseManager.initLicense('DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9');

(async()=>{
  // you can get the image from https://github.com/Dynamsoft/capture-vision-nodejs-samples/blob/main/AllSupportedBarcodeTypes.png
  // The second parameter `templateName` tells the SDK how to process this image.
  let result = await CaptureVisionRouter.captureAsync('./AllSupportedBarcodeTypes.png', EnumPresetTemplate.PT_READ_BARCODES_READ_RATE_FIRST);
  // refer to https://www.dynamsoft.com/capture-vision/docs/server/programming/cplusplus/api-reference/capture-vision-router/auxiliary-classes/captured-result.html?product=dbr&lang=cplusplus
  // or run `console.log(require('node:util').inspect(result, false, null))` to see details
  for(let item of result.barcodeResultItems){
    console.log(item.text);
  }

  // Terminate workers so you can exit the process.
  // Don't call it if you still need to use the SDK.
  await CaptureVisionRouter.terminateIdleWorkers();
})();
```

If your trial license has expired, please visit https://www.dynamsoft.com/customer/license/trialLicense -> Barcode Reader / Capture Vision Suite -> Desktop/Server.

> [!NOTE]
> Guides for tasks such as Label Recognition and Document Capturing are under development. You can refer to the [C++ document](https://www.dynamsoft.com/capture-vision/docs/server/programming/cplusplus/user-guide/index.html) while writing code for Node.js. Or [contact us](https://www.dynamsoft.com/contact/) for assistance.

## Template Customization

The functionality of DCV largely depends on the choice of template. Dynamsoft offers preset templates in `EnumPresetTemplate.XXXX`. Here is the part about barcodes:

```typescript
/** compatible with "read-barcodes" */
PT_READ_BARCODES = "ReadBarcodes_Default",
/** Represents a barcode reading mode where speed is prioritized. */
PT_READ_BARCODES_SPEED_FIRST = "ReadBarcodes_SpeedFirst",
/** Represents a barcode reading mode where barcode read rate is prioritized. */
PT_READ_BARCODES_READ_RATE_FIRST = "ReadBarcodes_ReadRateFirst",
/** Represents a barcode reading mode for single barcode code detection. */
PT_READ_SINGLE_BARCODE = "ReadSingleBarcode",
```

### How to Specify the Barcode Formats

Below is an example illustrating how to modify the target barcode formats for `PT_READ_BARCODES_READ_RATE_FIRST`.

1. Copy the SDK's `Templates\DBR-PresetTemplates.json` to your directory. This file contains all the preset templates related to barcode reading.

2. Search `BarcodeFormatIds` and choose the one you need.

   e.g., If you only want to read specific barcode formats and ensure a high recognition rate in `PT_READ_BARCODES_READ_RATE_FIRST`, you can modify the `BarcodeFormatIds` object in the `task-read-barcodes-read-rate` task.

3. Suppose you only want to recognize `QRCode` and `DataMatrix`; you can change `BarcodeFormatIds` like this. You can get barcode format strings [here](https://www.dynamsoft.com/capture-vision/docs/core/enums/barcode-reader/barcode-format.html).

   >```diff
   >  "Name": "task-read-barcodes-read-rate",
   >  "ExpectedBarcodesCount": 0,
   >  "BarcodeFormatIds": [
   >-  "BF_DEFAULT"
   >+  "BF_QR_CODE",
   >+  "BF_DATAMATRIX"
   >  ],
   >```

4. Apply this template.
   ```js
   CaptureVisionRouter.initSettings('path/to/the/template/file');
   ```

> [!WARNING]
> Due to its powerful customization capabilities, the number of configurable parameters in the templates is extensive and relatively complex. To ease your workload, if the preset templates do not meet your requirements, feel free to [contact us](https://www.dynamsoft.com/contact/) for a customized template.

## About the `capture` like API

`captureAsync(...)` processes images in [worker](https://nodejs.org/api/worker_threads.html). The maximum number of workers is defined by `CaptureVisionRouter.maxWorkerCount`, which defaults to `<logical processor number> - 1` (minimum of 1). If you continue to call `captureAsync(...)` while all workers are busy, the tasks will be queued and wait for execution. You can get the queue length by `CaptureVisionRouter.waitQueueLength`.

The synchronous version is `capture(...)`, which processes images on the main thread.

The `capture` -like APIs can accept file path `string` or file bytes `Uint8Array` as input data. Currently supported file types are jpg, png, bmp, gif, pdf, tiff. The `capture` like APIs also accept `DCVImageData` as input data. Typically used to process raw data from a camera.
```ts
interface DCVImageData{
  bytes: Uint8Array;
  width: number;
  height: number;
  stride: number;
  format: EnumImagePixelFormat;
  /** EXIF orientation; 1 or undefined means no rotate. */
  orientation?: number;
}
```

If input data is file bytes or `DCVImageData`, by default, `captureAsync(...)` will [transfer](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage#transfer) bytes into worker. Thus you can't access these bytes in the main thread after `captureAsync`. This allows for optimal performance.

The following code can prevent bytes from being transferred.
```js
let result = await CaptureVisionRouter.captureAsync(
  input_data_contains_bytes, {
    templateName: EnumPresetTemplate.XXXX,
    dataTransferType: 'copy'
  }
);
```

For multi-page PDFs and TIFFs, you can use `captureMultiPages`.
```js
let results = await CaptureVisionRouter.captureMultiPagesAsync('./multi-page.pdf', EnumPresetTemplate.XXXX);
for(let result of results){
  const tag = result.originalImageTag;
  console.log(`# page ${tag.pageNumber}/${tag.totalPages}:`);
  for(let item of result.barcodeResultItems){
    console.log(item.text);
  }
}
```

## Supported OS/Arch

Node.js >= 16.x

|  os  |  arch  |
|:-----|:-------|
| win32 (windows) |  x86, x64 (Vista or newer) |
| linux | x64 (glibc >= 2.18), arm64 |
| darwin (mac) | x64, arm64 |

> [!CAUTION]
> Since the Dynamsoft Capture Vision 3.x version of `.dylib` is not fully released, only the barcode reader feature is available on the `darwin` platform.

You can force(`-f`) install resource packages (dynamic libraries) for other OS/arch. So you can develop and deploy on different machines. You can check the `<OS>-<arch>@<version>` in this SDK's [`package.json`->`optionalDependencies`](https://github.com/Dynamsoft/capture-vision-nodejs-samples/blob/main/package.json#L60).

```sh
npm i dynamsoft-capture-vision-for-node-lib-<OS>-<arch>@<version> -f -E
```

## Samples

### Web Service

[Express sample](https://github.com/Dynamsoft/capture-vision-nodejs-samples/tree/main/express) and [koa sample](https://github.com/Dynamsoft/capture-vision-nodejs-samples/tree/main/koa) show how to use the SDK in a web service.

You do not need to start multiple process instances in [PM2 Cluster mode](https://pm2.keymetrics.io/docs/usage/quick-start/#cluster-mode). As mentioned above, Dynamsoft Capture Vision for Node already manages a thread pool. However, `pm2 start app.js` is still useful, it can automatically restart `app.js` when the service crashes.

### AWS Lambda

We also made a special adaptation for AWS Lambda; see [this sample](https://github.com/Dynamsoft/capture-vision-nodejs-samples/tree/main/lambda). Other similar single-function platforms may have some compatibility issues. If you have any needs, please contact us.

## Special Notes

### AI Model for Label Recognizer

When performing text recognition tasks, you need to install `dynamsoft-capture-vision-for-node-model`. You can check the `<version>` in the SDK's [`package.json`->`peerDependencies`](https://github.com/Dynamsoft/capture-vision-nodejs-samples/blob/main/package.json#L52).
```sh
npm i dynamsoft-capture-vision-for-node-model@<version> -E
```

### Multiple `CaptureVisionRouter` Instances

In some **rare** cases, you may need multiple `CaptureVisionRouter` instances, such as customizing different templates for each instance. Here is how to use:

```js
let cvr = new CaptureVisionRouter();

let settings = cvr.outputSettings('<templateName>');
settings.foo = bar;
cvr.initSettings(settings);

let result = await cvr.captureAsync('<image>', '<templateName>');
```
