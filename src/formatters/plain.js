import _ from 'lodash';

const getKeyFullPath = (parentKeyFullPath, keyName) => {
  const keyFullPath = (parentKeyFullPath) ? `${parentKeyFullPath}.${keyName}` : keyName;
  return keyFullPath;
};

const castValueToStr = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (typeof (value) === 'string') {
    return `'${value}'`;
  }

  return value;
};

const convertAddedKey = (parentKeyFullPath, keyName, value) => {
  const keyFullPath = getKeyFullPath(parentKeyFullPath, keyName);
  const plainValue = castValueToStr(value);
  return `Property '${keyFullPath}' was added with value: ${plainValue}`;
};

const convertRemovedKey = (parentKeyFullPath, keyName) => {
  const keyFullPath = getKeyFullPath(parentKeyFullPath, keyName);
  return `Property '${keyFullPath}' was removed`;
};

const convertChangedKey = (parentKeyFullPath, keyName, value1, value2) => {
  const keyFullPath = getKeyFullPath(parentKeyFullPath, keyName);
  const plainValue1 = castValueToStr(value1);
  const plainValue2 = castValueToStr(value2);
  return `Property '${keyFullPath}' was updated. From ${plainValue1} to ${plainValue2}`;
};

const getPlainOutput = (diffAST) => {
  const innerIter = (innerDiffAST, parentKeyFullPath) => {
    const plainKeyValues = innerDiffAST
      .filter((keyObj) => (keyObj.type !== 'notChanged'))
      .map((keyObj) => {
        switch (keyObj.type) {
          case 'added':
            return convertAddedKey(parentKeyFullPath, keyObj.keyName, keyObj.value);
          case 'removed':
            return convertRemovedKey(parentKeyFullPath, keyObj.keyName);
          case 'changed':
            return convertChangedKey(
              parentKeyFullPath,
              keyObj.keyName,
              keyObj.value1,
              keyObj.value2,
            );
          case 'nested': {
            const keyFullPath = getKeyFullPath(parentKeyFullPath, keyObj.keyName);
            return innerIter(keyObj.children, keyFullPath);
          }
          default:
            throw new Error(`Undefined key type: "${keyObj.type}"`);
        }
      });

    return plainKeyValues.join('\n');
  };

  return innerIter(diffAST, null);
};

export default getPlainOutput;
