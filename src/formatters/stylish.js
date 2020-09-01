import _ from 'lodash';

const addedSign = '+ ';
const removedSign = '- ';
const notChangedSign = '';
const emptySign = '';

const getIndentCount = (depth) => {
  const indentCount = 4;
  return (indentCount + depth * indentCount);
};
const getIndent = (depth, signLength = 0) => (' '.repeat(getIndentCount(depth) - signLength));

const stringifyKey = (key, sign, depth) => (`${getIndent(depth, sign.length)}${sign}${key}`);

const stringifyValue = (value, depth) => {
  // value has Object type
  if (_.isObject(value)) {
    const stylishValues = Object.entries(value)
      .map(([key, val]) => {
        const stylishKey = stringifyKey(key, emptySign, depth + 1);
        const stylishValue = stringifyValue(val, depth + 1);

        return `${stylishKey}: ${stylishValue}`;
      });

    return `{\n${stylishValues.join('\n')}\n${getIndent(depth)}}`;
  }

  // value has Plain type
  return value;
};

const convertAddedKey = (key, value, depth) => {
  const stylishKey = stringifyKey(key, addedSign, depth);
  const stylishValue = stringifyValue(value, depth);

  return `${stylishKey}: ${stylishValue}`;
};

const convertRemovedKey = (key, value, depth) => {
  const stylishKey = stringifyKey(key, removedSign, depth);
  const stylishValue = stringifyValue(value, depth);

  return `${stylishKey}: ${stylishValue}`;
};

const convertChangedKey = (key, value1, value2, depth) => {
  const stylishKeyAST1 = stringifyKey(key, removedSign, depth);
  const stylishValueAST1 = stringifyValue(value1, depth);
  const stylishChangedKeyAST1 = `${stylishKeyAST1}: ${stylishValueAST1}`;

  const stylishKeyAST2 = stringifyKey(key, addedSign, depth);
  const stylishValueAST2 = stringifyValue(value2, depth);
  const stylishChangedKeyAST2 = `${stylishKeyAST2}: ${stylishValueAST2}`;

  return [stylishChangedKeyAST1, stylishChangedKeyAST2].join('\n');
};

const convertNotChangedKey = (key, value, depth) => {
  const stylishKey = stringifyKey(key, notChangedSign, depth);
  const stylishValue = stringifyValue(value, depth);

  return `${stylishKey}: ${stylishValue}`;
};

const convertNestedKey = (key, value, depth) => {
  const stylishKey = stringifyKey(key, emptySign, depth);
  const stylishValue = stringifyValue(value, depth);

  return `${stylishKey}: ${stylishValue}`;
};

const getStylishOutput = (diffAST) => {
  const iter = (iterDiffAST, depth) => {
    const stylishKeyValues = iterDiffAST
      .map((keyAST) => {
        switch (keyAST.type) {
          case 'added':
            return convertAddedKey(
              keyAST.key,
              keyAST.value,
              depth,
            );
          case 'removed':
            return convertRemovedKey(
              keyAST.key,
              keyAST.value,
              depth,
            );
          case 'changed': {
            return convertChangedKey(
              keyAST.key,
              keyAST.value1,
              keyAST.value2,
              depth,
            );
          }
          case 'notChanged':
            return convertNotChangedKey(
              keyAST.key,
              keyAST.value,
              depth,
            );
          case 'nested': {
            const nestedValue = iter(keyAST.children, depth + 1);

            return convertNestedKey(
              keyAST.key,
              nestedValue,
              depth,
            );
          }
          default:
            throw new Error(`Undefined key type: "${keyAST.type}"`);
        }
      });

    return [
      '{',
      stylishKeyValues.join('\n'),
      `${getIndent(depth - 1)}}`,
    ].join('\n');
  };

  return iter(diffAST, 0);
};

export default getStylishOutput;
