import _ from 'lodash';

const buildDiffAST = (obj1, obj2) => {
  const allKeys = _.sortBy(_.union(Object.keys(obj1), Object.keys(obj2)));

  const diffAST = allKeys
    .map((key) => {
      if (!_.has(obj1, key)) {
        return {
          key,
          type: 'added',
          value: obj2[key],
        };
      }

      if (!_.has(obj2, key)) {
        return {
          key,
          type: 'removed',
          value: obj1[key],
        };
      }

      if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
        return {
          key,
          type: 'nested',
          children: buildDiffAST(obj1[key], obj2[key]),
        };
      }

      if (obj1[key] === obj2[key]) {
        return {
          key,
          type: 'notChanged',
          value: obj1[key],
        };
      }

      return {
        key,
        type: 'changed',
        value1: obj1[key],
        value2: obj2[key],
      };
    });

  return diffAST;
};

export default buildDiffAST;
