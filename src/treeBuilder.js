import _ from 'lodash';

const buildDiff = (data1, data2) => {
  const allKeys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)));

  const diff = allKeys
    .map((key) => {
      if (!_.has(data1, key)) {
        return { key, type: 'added', value: data2[key] };
      }

      if (!_.has(data2, key)) {
        return { key, type: 'removed', value: data1[key] };
      }

      if (_.isObject(data1[key]) && _.isObject(data2[key])) {
        return { key, type: 'nested', children: buildDiff(data1[key], data2[key]) };
      }

      if (data1[key] === data2[key]) {
        return { key, type: 'notChanged', value: data1[key] };
      }

      return {
        key, type: 'changed', value1: data1[key], value2: data2[key],
      };
    });

  return diff;
};

export default buildDiff;
