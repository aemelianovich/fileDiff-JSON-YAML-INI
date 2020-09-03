import { readFile, getFileFormat } from './utils.js';
import parseData from './parsers.js';
import buildDiff from './treeBuilder.js';
import format from './formatters/index.js';

const genDiff = (filePath1, filePath2, formatType) => {
  const fileData1 = readFile(filePath1);
  const dataFormat1 = getFileFormat(filePath1);

  const fileData2 = readFile(filePath2);
  const dataFormat2 = getFileFormat(filePath2);

  const obj1 = parseData(fileData1, dataFormat1);
  const obj2 = parseData(fileData2, dataFormat2);

  const diff = buildDiff(obj1, obj2);

  return format(diff, formatType);
};

export default genDiff;
