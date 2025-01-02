# Use Dynamsoft Capture Vision for Node in Lambda

This sample shows how to deploy a barcode decoding service in AWS Lambda.

> [!WARNING]
> This tutorial is intended for beginner developers and some steps may not be best practices.

## Supported Lambda Environments

We support lambda nodejs 20 and above environments, both x64 and arm64.

## Prerequisites

1. Have nodejs installed on your local development machine.

2. An account with access to the AWS Console.

3. Know how to unzip or compress files.

4. Know how to open a terminal and use the `cd` command.

## Get the Sample

If you don't have this sample locally, please copy the url to a browser and download it.

```
https://github.com/Dynamsoft/capture-vision-nodejs-samples/archive/refs/heads/main.zip
```

Unzip it, assuming you unzipped it to `path/to/capture-vision-nodejs-samples-main`.

Go into the `lambda` folder. Now the path is `path/to/capture-vision-nodejs-samples-main/lambda`.

## Trial License

Please visit https://www.dynamsoft.com/customer/license/trialLicense -> Barcode Reader / Capture Vision Suite -> Desktop/Server. Then replace `Your license` in your source code (`index.js` and `index.mjs`).

## Install Dependency

Open the terminal. `cd` to the directory.
```sh
cd path/to/capture-vision-nodejs-samples-main/lambda
```

Install dependencies.
```sh
npm i
```

If your local development machine is not of the same OS/arch as your target lambda (linux x64/arm64), you need to force install another dependency as well.

```sh
npm i dynamsoft-capture-vision-for-node-lib-linux-<arch>@<version> -f -E
```
You can find `<arch>@<version>` in [`node_modules/dynamsoft-capture-vision-for-node/package.json`->`optionalDependencies`](https://github.com/Dynamsoft/capture-vision-nodejs-samples/blob/main/package.json#L56).


## (Optional) Commonjs and ES Module

We provide both `index.js` or `index.mjs`. You can choose one you like and delete another.

## (Optional) Save Disk Space

If your local development machine is not of the same OS/arch as lambda, it is better to remove the useless `node_modules/dynamsoft-capture-vision-for-node-dylib-<OS>-<arch>` before deployment.

You can also remove some files in `node_modules/koffi`, only left:
* `node_modules/koffi/build/koffi/<target os_arch>`
* `node_modules/koffi/index.js`
* `node_modules/koffi/package.json`

## Create the Lambda Function

Compress the files in the `lambda` directory to `lambda.zip`. Do not include the root directory `lambda`.

Open AWS Console page in browser.

Type `lambda` in the search box of AWS Console. Then enter Lambda Console.

`Create function` -> Any function name -> Choose `x86_64` or `arm64` ->

`Additional configurations` -> Enable `function url` ->

`Auth type` as None -> Enable `CORS` ->

Click `create function` and it go to a new page ->

Click `upload from` -> `.zip file` -> Choose `lambda.zip` you created ->

Waiting... Until it says like "Successfully uploaded file." ->

You can see files in `Code source` changed, if not, refresh page -> Deploy ->

Go to `Configuration` tab -> `General configuration` -> Edit ->

Memory to 256MB, timeout to 1 min -> `Function URL` -> Copy URL

## Front-end Upload Image

`index.html` is a front-end example. Please edit `index.html` that in your local development machine, replace `https://<url-id>.lambda-url.<region>.on.aws/` to the `Function URL` you copied.

Open the `index.html` in a browser. Click and select an image to upload.

If everything goes well, you will see the text result.

