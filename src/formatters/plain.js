import _ from 'lodash';

const getKeyFullPath = (parentKeys, key) => [...parentKeys, key].join('.');

const stringifyValue = (value) => {
  if (!_.isObject(value) && !_.isString(value)) {
    return value;
  }

  if (_.isString(value)) {
    return `'${value}'`;
  }

  return '[complex value]';
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
  const iter = (subTree, parentKeys) => {
    const plainKeyValues = subTree
      .filter((node) => (node.type !== 'notChanged'))
      .map((node) => {
        switch (node.type) {
          case 'added':
            return convertAddedKey(parentKeys, node.key, node.value);
          case 'removed':
            return convertRemovedKey(parentKeys, node.key);
          case 'changed':
            return convertChangedKey(parentKeys, node.key, node.value1, node.value2);
          case 'nested': {
            return iter(node.children, [...parentKeys, node.key]);
          }
          default:
            throw new Error(`Undefined key type: "${node.type}"`);
        }
      });

    return plainKeyValues.join('\n');
  };

  return iter(diffAST, []);
};

export default getPlainOutput;
