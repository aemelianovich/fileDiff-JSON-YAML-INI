import { readFile } from './utils.js';
import Comparison from './comparison.js';

const compareJsonFiles = (filePath1, filePath2) => {
  const jsonObj1 = JSON.parse(readFile(filePath1));
  const jsonObj2 = JSON.parse(readFile(filePath2));

  const jsonComparison = Object.create(Comparison);
  jsonComparison.initComparison(jsonObj1, jsonObj2);

  return jsonComparison.toString();
};

export default compareJsonFiles;
