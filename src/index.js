import path from 'path';
import fs from 'fs';
import _ from 'lodash';

const readFile = (filePath) => {
  const resolvedPath = path.resolve(filePath);
  const file = fs.readFileSync(resolvedPath, 'utf-8');

  return file;
};

const addKeyValue = (keyValue) => ((typeof (keyValue) === 'object') ? JSON.parse(JSON.stringify(keyValue)) : keyValue);

const convertComparisonObjToStr = (obj) => {
  const strArr = ['{'];

  const notChangedKeys = Object.entries(obj.notChanged);
  notChangedKeys.forEach((el) => {
    strArr.push(`      ${el[0]}: ${el[1]}`);
  });

  const changedKeys = Object.entries(obj.changed);
  changedKeys.forEach((el) => {
    strArr.push(`    + ${el[0]}: ${el[1][0]}`);
    strArr.push(`    - ${el[0]}: ${el[1][1]}`);
  });

  const addedKeys = Object.entries(obj.added);
  addedKeys.forEach((el) => {
    strArr.push(`    + ${el[0]}: ${el[1]}`);
  });

  const removedKeys = Object.entries(obj.removed);
  removedKeys.forEach((el) => {
    strArr.push(`    - ${el[0]}: ${el[1]}`);
  });

  strArr.push('}');

  return strArr.join('\n');
};

const compareObjects = (obj1, obj2) => {
  const comparisonObj = {
    notChanged: {},
    changed: {},
    added: {},
    removed: {},
  };

  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  const addedKeys = _.difference(obj2Keys, obj1Keys);
  addedKeys.forEach((el) => { comparisonObj.added[el] = addKeyValue(obj2[el]); });

  const removedKeys = _.difference(obj1Keys, obj2Keys);
  removedKeys.forEach((el) => { comparisonObj.removed[el] = addKeyValue(obj1[el]); });

  const commonKeys = _.intersection(obj1Keys, obj2Keys);
  commonKeys.forEach((el) => {
    if (obj1[el] === obj2[el]) {
      comparisonObj.notChanged[el] = addKeyValue(obj2[el]);
    } else {
      comparisonObj.changed[el] = [addKeyValue(obj2[el]), addKeyValue(obj1[el])];
    }
  });

  return comparisonObj;
};

const compareJsonFiles = (filePath1, filePath2) => {
  const jsonObj1 = JSON.parse(readFile(filePath1));
  const jsonObj2 = JSON.parse(readFile(filePath2));

  const resObj = compareObjects(jsonObj1, jsonObj2);

  return convertComparisonObjToStr(resObj);
};

export default compareJsonFiles;
