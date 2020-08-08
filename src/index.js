import parseFile from './parsers.js';
import Comparison from './comparison.js';
import getFormattedStr from './formatters/index.js';

const genDiff = (filePath1, filePath2, format) => {
  const obj1 = parseFile(filePath1);
  const obj2 = parseFile(filePath2);

  const comparisonObj = Object.create(Comparison);
  comparisonObj.initComparison(obj1, obj2);

  return getFormattedStr(comparisonObj, format);
};

export default genDiff;
