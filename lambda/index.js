const { LiceseManager, CaptureVisionRouter } = require('dynamsoft-capture-vision-for-node');
const parser = require('lambda-multipart-parser');

// You can get your trial license from
// https://www.dynamsoft.com/customer/license/trialLicense -> Barcode Reader -> Desktop/Server
LiceseManager.initLicense('');

// refer: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html
exports.handler = async (event, context) => {

  // handle `multpart/form-data`
  // Pls refer to https://www.npmjs.com/package/lambda-multipart-parser
  // to appropriately configure API Gateway.
  const request = await parser.parse(event);

  // You can only use the synchronous version of `capture` in lambda.
  let result = CaptureVisionRouter.capture(request.files[0].content, 'ReadSingleBarcode');

  return {
    'statusCode': 200,
    'headers':{
      "Access-Control-Allow-Origin":"*",
    },
    'body': JSON.stringify(result.barcodeResultItems),
  };
};