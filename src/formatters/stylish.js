import _ from 'lodash';

const addIndent = (str, depth, signLength = 0) => {
  const indentCount = (4 + depth * 4) - signLength;
  return `${' '.repeat(indentCount)}${str}`;
};

const stringifyValue = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }

  const stylishValues = Object.entries(value)
    // eslint-disable-next-line no-use-before-define
    .map(([key, val]) => convertKey(key, val, depth + 1));

  return `{\n${stylishValues.join('\n')}\n${addIndent('}', depth)}`;
};

const convertKey = (key, value, depth) => {
  const stylishValue = stringifyValue(value, depth);
  const stylishKey = `${key}: ${stylishValue}`;
  return addIndent(stylishKey, depth);
};

const convertAddedKey = (key, value, depth) => {
  const stylishValue = stringifyValue(value, depth);
  const stylishKey = `+ ${key}: ${stylishValue}`;
  return addIndent(stylishKey, depth, '+ '.length);
};

const convertRemovedKey = (key, value, depth) => {
  const stylishValue = stringifyValue(value, depth);
  const stylishKey = `- ${key}: ${stylishValue}`;
  return addIndent(stylishKey, depth, '- '.length);
};

const convertChangedKey = (key, value1, value2, depth) => {
  const stylishValueAST1 = stringifyValue(value1, depth);
  const stylishKeyAST1 = `- ${key}: ${stylishValueAST1}`;
  const stylishChangedKeyAST1 = addIndent(stylishKeyAST1, depth, '- '.length);

  const stylishValueAST2 = stringifyValue(value2, depth);
  const stylishKeyAST2 = `+ ${key}: ${stylishValueAST2}`;
  const stylishChangedKeyAST2 = addIndent(stylishKeyAST2, depth, '+ '.length);

  return [stylishChangedKeyAST1, stylishChangedKeyAST2].join('\n');
};

const getStylishOutput = (diffAST) => {
  const iter = (subTree, depth) => {
    const stylishKeyValues = subTree
      .map((node) => {
        switch (node.type) {
          case 'added':
            return convertAddedKey(node.key, node.value, depth);
          case 'removed':
            return convertRemovedKey(node.key, node.value, depth);
          case 'changed': {
            return convertChangedKey(node.key, node.value1, node.value2, depth);
          }
          case 'notChanged':
            return convertKey(node.key, node.value, depth);
          case 'nested': {
            return convertKey(node.key, iter(node.children, depth + 1), depth);
          }
          default:
            throw new Error(`Undefined key type: "${node.type}"`);
        }
      });

    return [
      '{',
      stylishKeyValues.join('\n'),
      addIndent('}', depth - 1),
    ].join('\n');
  };

  return iter(diffAST, 0);
};

export default getStylishOutput;
