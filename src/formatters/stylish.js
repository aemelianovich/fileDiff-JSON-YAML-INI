import _ from 'lodash';

const addedSign = '+ ';
const removedSign = '- ';
const notChangedSign = '';
const emptySign = '';

const getIndentCount = (depthLevel) => {
  const stylishIndentCount = 4;
  return (stylishIndentCount + depthLevel * stylishIndentCount);
};
const getIndent = (depthLevel, signLength = 0) => (' '.repeat(getIndentCount(depthLevel) - signLength));
const getStylishKeyStr = (keyName, sign, depthLevel) => (`${getIndent(depthLevel, sign.length)}${sign}${keyName}`);

const getStylishKeyValueStr = (keyName, keyValue, sign, depthLevel) => {
  const getStylishValueStr = (value, valueDepthLevel) => {
    // value has Object type
    if (_.isObject(value)) {
      const stylishValues = Object.entries(value)
        .map(([key, val]) => getStylishKeyValueStr(key, val, emptySign, valueDepthLevel + 1));

      return `{\n${stylishValues.join('\n')}\n${getIndent(valueDepthLevel)}}`;
    }

    // value has Plain type
    return value;
  };

  const stylishKeyStr = getStylishKeyStr(keyName, sign, depthLevel);
  const stylishValueStr = getStylishValueStr(keyValue, depthLevel);

  return `${stylishKeyStr}: ${stylishValueStr}`;
};

const getStylishResult = (comparisonAST) => {
  const innerIter = (innerComparisonAST, depthLevel) => {
    const stylishKeyValues = innerComparisonAST
      .map((keyObj) => {
        switch (keyObj.type) {
          case 'added':
            return getStylishKeyValueStr(
              keyObj.keyName,
              keyObj.value,
              addedSign,
              depthLevel,
            );
          case 'removed':
            return getStylishKeyValueStr(
              keyObj.keyName,
              keyObj.value,
              removedSign,
              depthLevel,
            );
          case 'changed': {
            const stylishChangedValue1 = getStylishKeyValueStr(
              keyObj.keyName,
              keyObj.value1,
              removedSign,
              depthLevel,
            );

            const stylishChangedValue2 = getStylishKeyValueStr(
              keyObj.keyName,
              keyObj.value2,
              addedSign,
              depthLevel,
            );

            return [stylishChangedValue1, stylishChangedValue2].join('\n');
          }
          case 'notChanged':
            return getStylishKeyValueStr(
              keyObj.keyName,
              keyObj.value,
              notChangedSign,
              depthLevel,
            );
          case 'nested': {
            const stylishNestedValue = innerIter(keyObj.children, depthLevel + 1);

            return getStylishKeyValueStr(
              keyObj.keyName,
              stylishNestedValue,
              emptySign,
              depthLevel,
            );
          }
          default:
            throw new Error(`Undefined key type: "${keyObj.type}"`);
        }
      });

    return ['{', stylishKeyValues.join('\n'), `${getIndent(depthLevel - 1)}}`].join('\n');
  };

  return innerIter(comparisonAST, 0);
};

export default getStylishResult;
