# Use Dynamsoft Capture Vision for Node in Lambda

This sample shows how to deploy a lambda decoding service.

If you don't know how to deploy a lambda service, please refer to: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html

We use [lambda-multipart-parser](https://www.npmjs.com/package/lambda-multipart-parser) to parse `multipart/form-data`. It's best to read its documentation to understand the API Gateway setup to support binary file uploads.

After testing, we support lambda nodejs 20 and above environments.

Depending on the lambda arch (x64/arm64) you use, you need to install the corresponding dependency.

```bash
npm i dynamsoft-capture-vision-for-node-dylib-linux-<arch>@<version> -f -E
```

If your development machine is not of the same arch as lambda, it is best to remove the useless `dynamsoft-capture-vision-for-node-dylib-<OS>-<arch>` to reduce the size.

`index.html` is a front-end example. Please make sure to modify the service address in the html.

