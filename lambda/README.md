# Use Dynamsoft Capture Vision for Node in Lambda

This sample shows how to deploy a lambda barcode decoding service.

## Prerequisites

1. You need to have basic nodejs and web development experience.

2. If you don't know how to deploy a lambda service, please refer to: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html

3. We use [lambda-multipart-parser](https://www.npmjs.com/package/lambda-multipart-parser) to parse `multipart/form-data`. It's best to read its documentation. You need configurate AWS API Gateway to support binary file uploads.

## Supported Environments

We support lambda nodejs 20 and above environments.

## Install Dependency

```
npm i
```

If your development machine is not of the same OS/arch as your target lambda (linux x64/arm64), you need to install a dependency.

```bash
npm i dynamsoft-capture-vision-for-node-lib-linux-<arch>@<version> -f -E
```
You can find `<arch>@<version>` in [`node_modules/dynamsoft-capture-vision-for-node/package.json`->`optionalDependencies`](https://github.com/Dynamsoft/capture-vision-nodejs-samples/blob/main/package.json#L56).

## Save Disk Space

If your development machine is not of the same OS/arch as lambda, it is better to remove the useless `node_modules/dynamsoft-capture-vision-for-node-dylib-<OS>-<arch>` before deployment.

You can also remove some files in `node_modules/koffi`, only left:
* `node_modules/koffi/build/koffi/<target os_arch>`
* `node_modules/koffi/index.js`
* `node_modules/koffi/package.json`

## Front-end Upload Image

`index.html` is a front-end example. Please make sure to modify the service address in the html.

