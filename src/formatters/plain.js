import _ from 'lodash';

const getKeyFullPath = (parentKeyFullPath, keyName) => {
  const keyFullPath = (parentKeyFullPath) ? `${parentKeyFullPath}.${keyName}` : keyName;
  return keyFullPath;
};

const getPlainValueStr = (value) => {
  if (!(_.isObject(value))) {
    return (typeof (value) === 'string') ? `'${value}'` : value;
  }

  return '[complex value]';
};

const getAddedPlainStr = (parentKeyFullPath, keyName, value) => {
  const keyFullPath = getKeyFullPath(parentKeyFullPath, keyName);
  const plainValueStr = getPlainValueStr(value);
  return `Property '${keyFullPath}' was added with value: ${plainValueStr}`;
};

const getRemovedPlainStr = (parentKeyFullPath, keyName) => {
  const keyFullPath = getKeyFullPath(parentKeyFullPath, keyName);
  return `Property '${keyFullPath}' was removed`;
};

const getChangedPlainStr = (parentKeyFullPath, keyName, value1, value2) => {
  const keyFullPath = getKeyFullPath(parentKeyFullPath, keyName);
  const plainValueStr1 = getPlainValueStr(value1);
  const plainValueStr2 = getPlainValueStr(value2);
  return `Property '${keyFullPath}' was updated. From ${plainValueStr1} to ${plainValueStr2}`;
};

const getPlainResult = (comparisonAST) => {
  const innerIter = (innerComparisonAST, parentKeyFullPath) => {
    const plainKeyValues = innerComparisonAST
      .filter((keyObj) => (
        keyObj.type === 'added'
        || keyObj.type === 'removed'
        || keyObj.type === 'changed'
        || keyObj.type === 'nested'
      ))
      .map((keyObj) => {
        let keyFullPath;
        switch (keyObj.type) {
          case 'added':
            return getAddedPlainStr(parentKeyFullPath, keyObj.keyName, keyObj.value);
          case 'removed':
            return getRemovedPlainStr(parentKeyFullPath, keyObj.keyName);
          case 'changed':
            return getChangedPlainStr(
              parentKeyFullPath,
              keyObj.keyName,
              keyObj.value1,
              keyObj.value2,
            );
          case 'nested':
            keyFullPath = getKeyFullPath(parentKeyFullPath, keyObj.keyName);
            return innerIter(keyObj.children, keyFullPath);
          default:
            throw new Error(`Undefined key type: "${keyObj.type}"`);
        }
      });

    return plainKeyValues.join('\n');
  };

  return innerIter(comparisonAST, null);
};

export default getPlainResult;
