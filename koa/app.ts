import Koa from 'koa';
import Router from '@koa/router';
import multer from '@koa/multer';
import serve from 'koa-static';
import { LicenseManager, CaptureVisionRouter, EnumPresetTemplate } from 'dynamsoft-capture-vision-for-node';

const app = new Koa();
const router = new Router();
const port = 3000;

// You can get your reading barcodes trial license from
// https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&package=desktop
// You can get your recognizing partial label text, capturing documents or other feature trial license from
// https://www.dynamsoft.com/customer/license/trialLicense?product=dcv&package=desktop
// The current license is valid for only one day.
LicenseManager.initLicense('DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9');

router.post('/api/capture',
  multer().single('image'), // handle `multpart/form-data`
  async ctx=>{
    let result = await CaptureVisionRouter.captureAsync(ctx.file.buffer, EnumPresetTemplate.PT_READ_BARCODES_READ_RATE_FIRST);
    const txts = [];
    for(let i of result.barcodeResultItems){
      txts.push(i.text);
    }
    ctx.body = JSON.stringify(txts);
  }
);

app.use(router.routes());
app.use(serve('public'));

app.listen(port);
console.log(`Open http://localhost:${port}/ for test.`);
