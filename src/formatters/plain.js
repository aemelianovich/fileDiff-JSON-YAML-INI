import _ from 'lodash';

const getKeyFullPath = (parentKeys, key) => [...parentKeys, key].join('.');

const stringifyValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (typeof (value) === 'string') {
    return `'${value}'`;
  }

  return value;
};

const convertAddedKey = (parentKeys, key, value) => {
  const keyFullPath = getKeyFullPath(parentKeys, key);
  const plainValue = stringifyValue(value);
  return `Property '${keyFullPath}' was added with value: ${plainValue}`;
};

const convertRemovedKey = (parentKeys, key) => {
  const keyFullPath = getKeyFullPath(parentKeys, key);
  return `Property '${keyFullPath}' was removed`;
};

const convertChangedKey = (parentKeys, key, value1, value2) => {
  const keyFullPath = getKeyFullPath(parentKeys, key);
  const plainValue1 = stringifyValue(value1);
  const plainValue2 = stringifyValue(value2);
  return `Property '${keyFullPath}' was updated. From ${plainValue1} to ${plainValue2}`;
};

const getPlainOutput = (diffAST) => {
  const iter = (iterDiffAST, parentKeys) => {
    const plainKeyValues = iterDiffAST
      .filter((keyAST) => (keyAST.type !== 'notChanged'))
      .map((keyAST) => {
        switch (keyAST.type) {
          case 'added':
            return convertAddedKey(parentKeys, keyAST.key, keyAST.value);
          case 'removed':
            return convertRemovedKey(parentKeys, keyAST.key);
          case 'changed':
            return convertChangedKey(
              parentKeys,
              keyAST.key,
              keyAST.value1,
              keyAST.value2,
            );
          case 'nested': {
            return iter(keyAST.children, [...parentKeys, keyAST.key]);
          }
          default:
            throw new Error(`Undefined key type: "${keyAST.type}"`);
        }
      });

    return plainKeyValues.join('\n');
  };

  return iter(diffAST, []);
};

export default getPlainOutput;
