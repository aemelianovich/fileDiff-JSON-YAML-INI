import _ from 'lodash';

const getIndent = (depth) => '  '.repeat(depth);

const stringifyValue = (data, depth, mapping) => {
  if (!_.isObject(data)) {
    return data;
  }

  const stylishValues = Object.entries(data)
    .map(([key, value]) => mapping.notChanged({ key, value }, depth + 2));

  return `{\n${stylishValues.join('\n')}\n${getIndent(depth + 2)}}`;
};

const mapping = {
  added: (node, depth) => `${getIndent(depth)}  + ${node.key}: ${stringifyValue(node.value, depth, mapping)}`,
  removed: (node, depth) => `${getIndent(depth)}  - ${node.key}: ${stringifyValue(node.value, depth, mapping)}`,
  changed: (node, depth) => {
    const output1 = `${getIndent(depth)}  - ${node.key}: ${stringifyValue(node.value1, depth, mapping)}`;
    const output2 = `${getIndent(depth)}  + ${node.key}: ${stringifyValue(node.value2, depth, mapping)}`;
    return [output1, output2];
  },
  notChanged: (node, depth) => `${getIndent(depth)}    ${node.key}: ${stringifyValue(node.value, depth, mapping)}`,
  nested: (node, depth, iter) => `${getIndent(depth)}    ${node.key}: ${iter(node.children, depth + 2)}`,
};

const formatStylish = (diff) => {
  const iter = (subTree, depth) => {
    const stylishOutput = subTree.flatMap((node) => mapping[node.type](node, depth, iter));

    return `{\n${stylishOutput.join('\n')}\n${getIndent(depth)}}`;
  };

  return iter(diff, 0);
};

export default formatStylish;
