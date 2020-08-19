import _ from 'lodash';

const stylishIndentNum = 4;

const addedSign = '+ ';
const removedSign = '- ';
const changedSign = { firstKeySign: '- ', secondKeySign: '+ ' };
const notChangedSign = '';
const emptySign = '';

const stylishSort = (obj1, obj2) => {
  if (obj1.keyName < obj2.keyName) {
    return -1;
  }
  if (obj1.keyName > obj2.keyName) {
    return 1;
  }

  return 0;
};

const getIndentNum = (indentNum, keyDepthLevel) => (indentNum + keyDepthLevel * indentNum);
const getIndentStr = (indentNum, keyDepthLevel) => (' '.repeat(getIndentNum(indentNum, keyDepthLevel)));
const getKeyStr = (keyName, sign, indentNum, keyDepthLevel) => {
  const keyIndent = getIndentNum(indentNum, keyDepthLevel) - sign.length;
  return `${' '.repeat(keyIndent)}${sign}${keyName}`;
};
const getStylishPlainKeyValueStr = (keyName, value, sign, indentNum, keyDepthLevel) => {
  const keyStr = getKeyStr(keyName, sign, indentNum, keyDepthLevel);
  return `${keyStr}: ${value}`;
};

const getStylishObjKeyValueStr = (keyName, value, sign, indentNum, keyDepthLevel) => {
  const keyStr = getKeyStr(keyName, sign, indentNum, keyDepthLevel);
  return `${keyStr}: {\n${value}\n${getIndentStr(indentNum, keyDepthLevel)}}`;
};

const getStylishStr = (keyObj, sign, depthLevel) => {
  // Plain value
  if (!(_.isObject(keyObj.value))) {
    return getStylishPlainKeyValueStr(
      keyObj.keyName,
      keyObj.value,
      sign,
      stylishIndentNum,
      depthLevel,
    );
  }

  const objKeyValues = Object.entries(keyObj.value)
    .map(([keyName, value]) => ({ keyName, value }));

  const stylishObjStr = objKeyValues
    .sort(stylishSort)
    .map((keyValueObj) => getStylishStr(keyValueObj, emptySign, depthLevel + 1))
    .join('\n');

  const stylishKeyValueStr = getStylishObjKeyValueStr(
    keyObj.keyName,
    stylishObjStr,
    sign,
    stylishIndentNum,
    depthLevel,
  );

  return stylishKeyValueStr;
};

const getStylishResult = (comparisonAST) => {
  const innerIter = (innerComparisonAST, depthLevel) => {
    const stylishKeyValues = innerComparisonAST
      .sort(stylishSort)
      .map((keyObj) => {
        let stylishChangedValue1;
        let stylishChangedValue2;
        let stylishNestedValue;
        switch (keyObj.type) {
          case 'added':
            return getStylishStr(keyObj, addedSign, depthLevel);
          case 'removed':
            return getStylishStr(keyObj, removedSign, depthLevel);
          case 'changed':
            stylishChangedValue1 = getStylishStr(
              { keyName: keyObj.keyName, value: keyObj.value1 },
              changedSign.firstKeySign,
              depthLevel,
            );

            stylishChangedValue2 = getStylishStr(
              { keyName: keyObj.keyName, value: keyObj.value2 },
              changedSign.secondKeySign,
              depthLevel,
            );

            return [stylishChangedValue1, stylishChangedValue2].join('\n');
          case 'notChanged':
            return getStylishStr(keyObj, notChangedSign, depthLevel);
          case 'nested':
            stylishNestedValue = innerIter(keyObj.children, depthLevel + 1);
            return getStylishObjKeyValueStr(
              keyObj.keyName,
              stylishNestedValue,
              emptySign,
              stylishIndentNum,
              depthLevel,
            );
          default:
            throw new Error(`Undefined key type: "${keyObj.type}"`);
        }
      });

    return stylishKeyValues.join('\n');
  };

  return ['{', innerIter(comparisonAST, 0), '}'].join('\n');
};

export default getStylishResult;
