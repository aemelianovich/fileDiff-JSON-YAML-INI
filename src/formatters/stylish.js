import _ from 'lodash';

const addIndent = (origStr, depth, signLength = 0, initIndentCount = 4) => {
  const indentCount = (initIndentCount + depth * initIndentCount) - signLength;
  return `${' '.repeat(indentCount)}${origStr}`;
};

const stringifyValue = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }

  const stylishValues = Object.entries(value)
    // eslint-disable-next-line no-use-before-define
    .map(([key, val]) => formatNotChanged(key, val, depth + 1));

  return `{\n${stylishValues.join('\n')}\n${addIndent('}', depth)}`;
};

const formatNotChanged = (key, value, depth) => {
  const stylishValue = stringifyValue(value, depth);
  const stylishKey = `${key}: ${stylishValue}`;
  return addIndent(stylishKey, depth);
};

const formatAdded = (key, value, depth) => {
  const stylishValue = stringifyValue(value, depth);
  const stylishKey = `+ ${key}: ${stylishValue}`;
  return addIndent(stylishKey, depth, '+ '.length);
};

const formatRemoved = (key, value, depth) => {
  const stylishValue = stringifyValue(value, depth);
  const stylishKey = `- ${key}: ${stylishValue}`;
  return addIndent(stylishKey, depth, '- '.length);
};

const formatChanged = (key, value1, value2, depth) => {
  const stylishRemovedKey = formatRemoved(key, value1, depth);
  const stylishAddedKey = formatAdded(key, value2, depth);

  return [stylishRemovedKey, stylishAddedKey].join('\n');
};

const mapping = {
  added: (node, depth) => formatAdded(node.key, node.value, depth),
  removed: (node, depth) => formatRemoved(node.key, node.value, depth),
  changed: (node, depth) => formatChanged(node.key, node.value1, node.value2, depth),
  notChanged: (node, depth) => formatNotChanged(node.key, node.value, depth),
  nested: (node, depth, iter) => formatNotChanged(node.key, iter(node.children, depth + 1), depth),
};

const formatStylish = (diff) => {
  const iter = (subTree, depth) => {
    const stylishKeyValues = subTree.map((node) => mapping[node.type](node, depth, iter));

    return [
      '{',
      stylishKeyValues.join('\n'),
      addIndent('}', depth - 1),
    ].join('\n');
  };

  return iter(diff, 0);
};

export default formatStylish;
