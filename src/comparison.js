import _ from 'lodash';

const getValue = (value) => {
  if (typeof (value) === 'string' && _.toNumber(value)) {
    return _.toNumber(value);
  }

  if (_.isObject(value)) {
    return Object.entries(value).reduce((acc, [key, val]) => {
      acc[key] = getValue(val);
      return acc;
    }, {});
  }
  return value;
};

const getComparisonAST = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  // Collect added keys
  const addedKeyValues = _.difference(obj2Keys, obj1Keys).map((addedKey) => {
    const addedKeyValueObj = {
      keyName: addedKey,
      type: 'added',
      value: getValue(obj2[addedKey]),
    };

    return addedKeyValueObj;
  });

  // Collect removed keys
  const removedKeyValues = _.difference(obj1Keys, obj2Keys).map((removedKey) => {
    const removedKeyValueObj = {
      keyName: removedKey,
      type: 'removed',
      value: getValue(obj1[removedKey]),
    };

    return removedKeyValueObj;
  });

  // Collect common keys
  const commonKeyValues = _.intersection(obj1Keys, obj2Keys).map((commonKey) => {
    // Collect nested keys
    if (_.isObject(obj1[commonKey]) && _.isObject(obj2[commonKey])) {
      const nestedKeyValueObj = {
        keyName: commonKey,
        type: 'nested',
        children: getComparisonAST(obj1[commonKey], obj2[commonKey]),
      };

      return nestedKeyValueObj;
    }

    // Collect not changed keys
    if (obj1[commonKey] === obj2[commonKey]) {
      const notChangedKeyValueObj = {
        keyName: commonKey,
        type: 'notChanged',
        value: getValue(obj1[commonKey]),
      };

      return notChangedKeyValueObj;
    }

    // Collect changed keys
    const changedKeyValueObj = {
      keyName: commonKey,
      type: 'changed',
      value1: getValue(obj1[commonKey]),
      value2: getValue(obj2[commonKey]),
    };

    return changedKeyValueObj;
  });

  return [...addedKeyValues, ...removedKeyValues, ...commonKeyValues];
};

export default getComparisonAST;
