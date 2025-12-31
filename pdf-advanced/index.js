/* eslint-disable no-console */

const { LicenseManager, CaptureVisionRouter, EnumPresetTemplate } = require('dynamsoft-capture-vision-for-node');
const pdf2png = require('./pdf2png.js');


// You can get your reading barcodes trial license from
// https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&package=desktop
// You can get your recognizing partial label text, capturing documents or other feature trial license from
// https://www.dynamsoft.com/customer/license/trialLicense?product=dcv&package=desktop
// The current license is valid for only one day.
LicenseManager.initLicense('DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9');

(async()=>{
    let fs = require('fs');
    let buffer = fs.readFileSync(__dirname + '/MultiPage.pdf');

    // https://en.wikipedia.org/wiki/List_of_file_signatures
    if(buffer.byteLength > 5 && 0 == buffer.compare(Buffer.from('255044462d','hex'), 0, 5, 0, 5)){
        // buffer is pdf
        let imgs = await pdf2png(new Uint8Array(buffer));
        for(let img of imgs){
            const result = await CaptureVisionRouter.captureAsync(new Uint8Array(img), EnumPresetTemplate.PT_READ_BARCODES_READ_RATE_FIRST);
            for(let item of result.barcodeResultItems){
                console.log(item.text);
            }
        }
    }else{
        // buffer is not pdf
        const result = await CaptureVisionRouter.captureAsync(new Uint8Array(buffer), EnumPresetTemplate.PT_READ_BARCODES_READ_RATE_FIRST);
        for(let item of result.barcodeResultItems){
            console.log(item.text);
        }
    }
    
    // Since the worker keep alive, you can call
    await CaptureVisionRouter.terminateIdleWorkers();
    // when you need to exit this process.
    // Or call
    process.exit();
    // directly.
})();