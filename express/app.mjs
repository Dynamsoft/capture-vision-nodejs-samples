import express from 'express';
import multer from 'multer';
import { LiceseManager, CaptureVisionRouter, EnumPresetTemplate } from 'dynamsoft-capture-vision-for-node';

const app = express();
const port = 3000;

// You can get your trial license from
// https://www.dynamsoft.com/customer/license/trialLicense -> Barcode Reader -> Desktop/Server
// The current used license is valid for 1 day.
LiceseManager.initLicense('DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9');

app.post('/api/capture',
  multer().single('image'), // handle `multpart/form-data`
  async(req, res)=>{
    let result = await CaptureVisionRouter.captureAsync(req.file.buffer, EnumPresetTemplate.PT_READ_BARCODES_READ_RATE_FIRST);
    const txts = [];
    for(let i of result.barcodeResultItems){
      txts.push(i.text);
    }
    res.send(JSON.stringify(txts));
  }
);
app.use(express.static('./public'));

app.listen(port, () => {
  console.log(`Open http://localhost:${port}/ for test.`);
});

