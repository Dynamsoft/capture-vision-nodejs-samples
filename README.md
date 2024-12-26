# Dynamsoft Capture Vision for Node

This is a nodejs wrapper for [Dynamsoft Capture Vision](https://www.dynamsoft.com/capture-vision/docs/server/programming/cplusplus/). You can use it to parse barcodes, recognize partial label text, capture documents, and more.

```bash
npm i dynamsoft-capture-vision-for-node@0.0.10 -E
```

Let's take parsing barcodes in a picture as an example.

```js
const { LiceseManager, CaptureVisionRouter, EnumPresetTemplate } = require('dynamsoft-capture-vision-for-node');

// You can get your trial license from
// https://www.dynamsoft.com/customer/license/trialLicense -> Barcode Reader -> Desktop/Server
// The current used license is valid for 1 day.
LiceseManager.initLicense('DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9');

//// In some cases you need custom templates provided by Dynamsoft Support
// CaptureVisionRouter.initSettings('path/to/template');

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

## The `capture` like API

`CaptureVisionRouter.captureAsync(...)` process image in [worker_threads](https://nodejs.org/api/worker_threads.html). The max number of worker is defined in `CaptureVisionRouter.maxWorkerCount`, by default `<logical processor number> - 1`, Minimum 1. If you continue to call `captureAsync(...)` when all workers are busy, it will be queued waiting for execution.

The synchronous version is `CaptureVisionRouter.capture(...)`, which processes images on the main thread.

The `capture` like APIs can accept file path `string` or file bytes `Uint8Array` as input data. Currently supported file types are jpg, png, bmp, gif, pdf.

The `capture` like APIs also accept `DCVImageData` as input data. Typically used to process raw data from a camera.
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

If input data is file bytes or `DCVImageData`, by default, `CaptureVisionRouter.captureAsync(...)` will [transfer](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage#transfer) bytes into `worker`. Thus you can't access to these bytes in main thread after `captureAsync`. This allows for optimal performance.

The following code can prevent bytes from being transferred.
```js
let result = await CaptureVisionRouter.captureAsync(input_data_contains_bytes, {
    templateName: EnumPresetTemplate.XXXX,
    dataTransferType: 'copy'
});
```

## Web Service

[Express sample](https://github.com/Dynamsoft/capture-vision-nodejs-samples/tree/main/express) and [koa sample](https://github.com/Dynamsoft/capture-vision-nodejs-samples/tree/main/koa) shows how to use the SDK in a web service. You do not need to start multiple instance processes in [PM2 Cluster mode](https://pm2.keymetrics.io/docs/usage/quick-start/#cluster-mode). As mentioned above, Dynamsoft Capture Vision for Node already manages a thread pool. 

However, `pm2 start app.js` is still useful, it can automatically restart `app.js` when service crashes.

## Supported OS/Arch

|  os  |  arch  |
|:-----|:-------|
| win32 (windows) | x86, x64 |
| linux | x64, amd64 |
| darwin (mac) | x64, amd64 |

> **Warning**: Since the Dynamsoft Capture Vision 2.6 version of `.dylib` is not compiled, the 2.4 version is used on the `darwin` platform, and the template and some other resources may be incompatible with `linux`/`win32`.

<!--If you are sure you don't need to support some of these OS/arch, you can delete some files in `node_modules/dynamsoft-capture-vision-for-node/dylib` and `node_modules/koffi`, to reduce the size. In some cloud platforms like AWS lambda, size is important.-->

You can install resources pkgs (dynamic libraries) for other OS/arch. So you can develop and deploy in different machines. You can check the `<OS>-<arch>@<version>` in this SDK's `package.json`->`optionalDependencies`.

```bash
npm i dynamsoft-capture-vision-for-node-lib-<OS>-<arch>@<version> -f -E
```

## AWS Lambda

We also made special adaptation for AWS lambda, see [this sample](https://github.com/Dynamsoft/capture-vision-nodejs-samples/tree/main/lambda). Other similar single-function platforms may have some compatibility issues. If you have any needs, please contact us.

## Label Recognize

You need install `dynamsoft-capture-vision-for-node-charactermodel`. You can check the `<version>` in SDK's `package.json`->`peerDependencies`.
```bash
npm i dynamsoft-capture-vision-for-node-charactermodel@<version> -E
```

## Multiple `CaptureVisionRouter` Instances

In some **rare** cases you may need multiple `CaptureVisionRouter` instances, such as customizing different templates for each instance. Here is how to use:

```js
let cvr = new CaptureVisionRouter();

let settings = cvr.outputSettings('<templateName>');
settings.foo = bar;
cvr.initSettings(settings);

let result = await cvr.captureAsync('<image>', '<templateName>');
```







