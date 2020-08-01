import parseFile from './parsers.js';
import Comparison from './comparison.js';

const compareFiles = (filePath1, filePath2) => {
  const obj1 = parseFile(filePath1);
  const obj2 = parseFile(filePath2);

  const comparisonObj = Object.create(Comparison);
  comparisonObj.initComparison(obj1, obj2);

  return comparisonObj.toString();
};

export default compareFiles;
