import path from 'path';
import fs from 'fs';
import { IOptions } from '../helpers/types';
import { v1 as uuidv1 } from 'uuid';

export const generateHtmlReport = (runnerResult: any, options: IOptions) => {
  const reportHtml = runnerResult.report;
  const fileName = options.targetUrl
    .replace(/^(https|http)?:\/\//, '')
    .replace('/', '-')
    .substring(0, 25)
    .concat(uuidv1().split('-')[0]);

  // Create reports folder
  const dirPath = path.join(process.cwd(), 'reports');

  // create the report directory, if doesnt exist
  if (!fs.existsSync(`${dirPath}`)) {
    fs.mkdirSync(dirPath);
  }

  // write the html report on disk
  fs.writeFileSync(`${dirPath}/${fileName}-report.html`, reportHtml);
};
