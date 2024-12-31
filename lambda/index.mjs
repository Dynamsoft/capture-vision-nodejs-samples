import { LicenseManager, CaptureVisionRouter, EnumPresetTemplate } from 'dynamsoft-capture-vision-for-node';

// You can get your trial license from
// https://www.dynamsoft.com/customer/license/trialLicense -> Barcode Reader / Capture Vision Suite -> Desktop/Server/Embedded
LicenseManager.initLicense('Your license');

// refer: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html
export const handler = async (event, context) => {
  try{
    // convert base64 back to buffer
    let buf = Buffer.from(event.body, 'base64');

    // You can only use the synchronous version of `capture` in lambda.
    let result = CaptureVisionRouter.capture(buf, EnumPresetTemplate.PT_READ_BARCODES_READ_RATE_FIRST);

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
