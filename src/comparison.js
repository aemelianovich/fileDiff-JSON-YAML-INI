import _ from 'lodash';
import { sortStrASC } from './utils.js';

const getComparisonAST = (obj1, obj2) => {
  const allKeys = _.union(Object.keys(obj1), Object.keys(obj2));

  const comparisonAST = allKeys
    .map((key) => {
      const [isObj1Key, isObj2Key] = [_.has(obj1, key), _.has(obj2, key)];
      switch (true) {
        case (isObj1Key === false && isObj2Key === true):
          return {
            keyName: key,
            type: 'added',
            value: obj2[key],
          };
        case (isObj1Key === true && isObj2Key === false):
          return {
            keyName: key,
            type: 'removed',
            value: obj1[key],
          };
        case (isObj1Key === true && isObj2Key === true):
          if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
            return {
              keyName: key,
              type: 'nested',
              children: getComparisonAST(obj1[key], obj2[key]),
            };
          }

          if (obj1[key] === obj2[key]) {
            return {
              keyName: key,
              type: 'notChanged',
              value: obj1[key],
            };
          }

          return {
            keyName: key,
            type: 'changed',
            value1: obj1[key],
            value2: obj2[key],
          };
        default:
          throw new Error(`Undefined key existence combination (isObj1Key = "${isObj1Key}", isObj2Key = "${isObj2Key}"`);
      }
    })
    .sort((objSort1, objSort2) => sortStrASC(objSort1.keyName, objSort2.keyName));

  return comparisonAST;
};

export default getComparisonAST;
