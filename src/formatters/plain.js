import _ from 'lodash';

const getPropertyName = (parentKeys, key) => [...parentKeys, key].join('.');

const stringifyValue = (value) => {
  if (!_.isObject(value) && !_.isString(value)) {
    return value;
  }

  if (_.isString(value)) {
    return `'${value}'`;
  }

  return '[complex value]';
};

const formatAdded = (parentKeys, key, value) => {
  const name = getPropertyName(parentKeys, key);
  const plainValue = stringifyValue(value);
  return `Property '${name}' was added with value: ${plainValue}`;
};

const formatRemoved = (parentKeys, key) => {
  const name = getPropertyName(parentKeys, key);
  return `Property '${name}' was removed`;
};

const formatChanged = (parentKeys, key, value1, value2) => {
  const name = getPropertyName(parentKeys, key);
  const plainValue1 = stringifyValue(value1);
  const plainValue2 = stringifyValue(value2);
  return `Property '${name}' was updated. From ${plainValue1} to ${plainValue2}`;
};

const formatPlain = (diff) => {
  const iter = (subTree, parentKeys) => {
    const plainKeyValues = subTree
      .filter((node) => (node.type !== 'notChanged'))
      .map((node) => {
        switch (node.type) {
          case 'added':
            return formatAdded(parentKeys, node.key, node.value);
          case 'removed':
            return formatRemoved(parentKeys, node.key);
          case 'changed':
            return formatChanged(parentKeys, node.key, node.value1, node.value2);
          case 'nested': {
            return iter(node.children, [...parentKeys, node.key]);
          }
          default:
            throw new Error(`Undefined key type: "${node.type}"`);
        }
      });

    return plainKeyValues.join('\n');
  };

  return iter(diff, []);
};

export default formatPlain;
