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
const convertKey = (keyName, sign, depth) => (`${getIndent(depth, sign.length)}${sign}${keyName}`);

const convertKeyValue = (keyName, keyValue, sign, depth) => {
  const convertValue = (value, valueDepth) => {
    // value has Object type
    if (_.isObject(value)) {
      const stylishValues = Object.entries(value)
        .map(([key, val]) => convertKeyValue(key, val, emptySign, valueDepth + 1));

      return `{\n${stylishValues.join('\n')}\n${getIndent(valueDepth)}}`;
    }

    // value has Plain type
    return value;
  };

  const stylishKey = convertKey(keyName, sign, depth);
  const stylishValue = convertValue(keyValue, depth);

  return `${stylishKey}: ${stylishValue}`;
};

const getStylishOutput = (comparisonAST) => {
  const innerIter = (innerComparisonAST, depth) => {
    const stylishKeyValues = innerComparisonAST
      .map((keyObj) => {
        switch (keyObj.type) {
          case 'added':
            return convertKeyValue(
              keyObj.keyName,
              keyObj.value,
              addedSign,
              depth,
            );
          case 'removed':
            return convertKeyValue(
              keyObj.keyName,
              keyObj.value,
              removedSign,
              depth,
            );
          case 'changed': {
            const changedValue1 = convertKeyValue(
              keyObj.keyName,
              keyObj.value1,
              removedSign,
              depth,
            );

            const changedValue2 = convertKeyValue(
              keyObj.keyName,
              keyObj.value2,
              addedSign,
              depth,
            );

            return [changedValue1, changedValue2].join('\n');
          }
          case 'notChanged':
            return convertKeyValue(
              keyObj.keyName,
              keyObj.value,
              notChangedSign,
              depth,
            );
          case 'nested': {
            const nestedValue = innerIter(keyObj.children, depth + 1);

            return convertKeyValue(
              keyObj.keyName,
              nestedValue,
              emptySign,
              depth,
            );
          }
          default:
            throw new Error(`Undefined key type: "${keyObj.type}"`);
        }
      });

    return ['{', stylishKeyValues.join('\n'), `${getIndent(depth - 1)}}`].join('\n');
  };

  return innerIter(comparisonAST, 0);
};

export default getStylishOutput;
