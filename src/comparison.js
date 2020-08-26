import _ from 'lodash';

const getComparisonAST = (obj1, obj2) => {
  const allKeys = _.union(Object.keys(obj1), Object.keys(obj2));

  const comparisonAST = allKeys
    .map((key) => {
      if (!_.has(obj1, key)) {
        return {
          keyName: key,
          type: 'added',
          value: obj2[key],
        };
      }

      if (!_.has(obj2, key)) {
        return {
          keyName: key,
          type: 'removed',
          value: obj1[key],
        };
      }

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
    });

  return _.sortBy(comparisonAST, [(obj) => obj.keyName]);
};

export default getComparisonAST;
