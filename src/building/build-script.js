import path from 'path';
import fs from 'fs';
import { DateTime } from 'luxon';

const currentDir = path.resolve();
const distDir = path.resolve(currentDir, 'dist');
const fileToCreate = distDir + '/userscript.js';

const jsBundle = fs.readFileSync(`${distDir}/speed.es.js`).toString();
const cssBundle = fs.readFileSync(`${distDir}/ve2.css`).toString();
const template = fs.readFileSync(`${currentDir}/src/building/template.txt`).toString();

const currDate = DateTime.now().toISODate();

fs.writeFileSync(
    fileToCreate,
    // jsBundle
    template
        .replace('$jsBundle', jsBundle)
        .replace('$cssBundle', cssBundle)
        .replace('$currentDate', currDate)
);
