import path from 'path';
import { readFile } from './utils.js';
import parseData from './parsers.js';
import buildDiffAST from './comparison.js';
import getFormattedOutput from './formatters/index.js';

const genDiff = (filePath1, filePath2, format) => {
  const fileData1 = readFile(filePath1);
  const dataFormat1 = path.extname(filePath1).substr(1);

  const fileData2 = readFile(filePath2);
  const dataFormat2 = path.extname(filePath2).substr(1);

  const obj1 = parseData(fileData1, dataFormat1);
  const obj2 = parseData(fileData2, dataFormat2);

  const diffAST = buildDiffAST(obj1, obj2);

  return getFormattedOutput(diffAST, format);
};

export default genDiff;
