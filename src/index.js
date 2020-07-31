import { readFileSync } from './utils.js';
import comparisonObj from './comparisonObj.js';

const compareJsonFiles = (filePath1, filePath2) => {
  const jsonObj1 = JSON.parse(readFileSync(filePath1));
  const jsonObj2 = JSON.parse(readFileSync(filePath2));

  const resObject = Object.create(comparisonObj);
  resObject.initComparisonObject(jsonObj1, jsonObj2);

  return resObject.toString();
};

export default compareJsonFiles;
