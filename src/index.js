import path from 'path';
import { readFile } from './utils.js';
import parseFile from './parsers.js';
import getComparisonAST from './comparison.js';
import getFormattedDiffStr from './formatters/index.js';

const genDiff = (filePath1, filePath2, format) => {
  const fileData1 = readFile(filePath1);
  const fileFormat1 = path.extname(filePath1);

  const fileData2 = readFile(filePath2);
  const fileFormat2 = path.extname(filePath2);

  const obj1 = parseFile(fileData1, fileFormat1);
  const obj2 = parseFile(fileData2, fileFormat2);

  const comparisonAST = getComparisonAST(obj1, obj2);

  return getFormattedDiffStr(comparisonAST, format);
};

export default genDiff;
