const { LicenseManager, CaptureVisionRouter, EnumPresetTemplate } = require('dynamsoft-capture-vision-for-node');

// You can get your reading barcodes trial license from
// https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&package=desktop
// You can get your recognizing partial label text, capturing documents or other feature trial license from
// https://www.dynamsoft.com/customer/license/trialLicense?product=dcv&package=desktop
LicenseManager.initLicense('Your license');

// refer: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html
exports.handler = async (event, context) => {
  try{
    // convert base64 back to buffer
    let buf = Buffer.from(event.body, 'base64');

    // You can only use the synchronous version of `capture` in lambda.
    let result = CaptureVisionRouter.capture(buf, EnumPresetTemplate.PT_READ_BARCODES_SPEED_FIRST);

    return {
      'statusCode': 200,
      'body': JSON.stringify(result.barcodeResultItems),
    };

  }catch(ex){

    console.error(ex.message);
    return {
      'statusCode': 400,
      'body': ex.message,
    };
  }
};
