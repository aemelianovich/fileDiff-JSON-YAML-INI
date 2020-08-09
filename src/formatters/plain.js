// Object that extends ComparisonKeyValue object to PlainKeyValue format.
// PlainKeyValue
// {
//    keyType,
//    parentKeyPath,
//    getKeyFullPath(),
//    getPlainValueStr(),
//    getPlainKeyValueStr(),
//
//    //Optional, for changed keys only:
//    plainValueObj2,
//    objectValueObj2,
//    getPlainValueStrObj2(),
//
//    //Optional, for common keys only:
//    commonObjectPlainStr,
//
//    // Assign Plain properties
//    // Link PlainKeyValue object with particular comparisonKeyValue object
//    initPlainKeyValue(
//      keyType,
//      parentKeyPath,
//      comparisonKeyValue,
//      comparisonKeyValueObj2,
//      commonObjectPlainStr
//    )
// }
const PlainKeyValue = {
  initPlainKeyValue(
    keyType,
    parentKeyPath,
    comparisonKeyValue,
    comparisonKeyValueObj2 = null,
    commonObjectPlainStr = null,
  ) {
    this.keyType = keyType;
    this.parentKeyPath = parentKeyPath;
    this.getKeyFullPath = function getKeyFullPath() {
      const keyFullPath = (this.parentKeyPath) ? `${this.parentKeyPath}.${this.keyName}` : this.keyName;
      return keyFullPath;
    };
    this.getPlainValueStr = function getPlainValueStr() {
      if (this.plainValue !== null) {
        return (typeof (this.plainValue) === 'string') ? `'${this.plainValue}'` : this.plainValue;
      }

      if (this.objectValue !== null) {
        return '[complex value]';
      }

      throw new Error('Either plain value or object value should be not equal to "null"');
    };

    // Choose method to show diff in plain format based on type of the key
    switch (keyType) {
      case 'added':
        this.getPlainKeyValueStr = function getPlainKeyValueStr() {
          return `Property '${this.getKeyFullPath()}' was added with value: ${this.getPlainValueStr()}`;
        };
        break;
      case 'removed':
        this.getPlainKeyValueStr = function getPlainKeyValueStr() {
          return `Property '${this.getKeyFullPath()}' was removed`;
        };
        break;
      case 'changed':
        this.plainValueObj2 = comparisonKeyValueObj2.plainValue;
        this.objectValueObj2 = comparisonKeyValueObj2.objectValue;
        this.getPlainValueStrObj2 = function getPlainValueStrObj2() {
          if (this.plainValueObj2 !== null) {
            return (typeof (this.plainValueObj2) === 'string') ? `'${this.plainValueObj2}'` : this.plainValueObj2;
          }

          if (this.objectValueObj2 !== null) {
            return '[complex value]';
          }

          throw new Error('Either plain value or object value should be not equal to "null"');
        };
        this.getPlainKeyValueStr = function getPlainKeyValueStr() {
          return `Property '${this.getKeyFullPath()}' was updated. From ${this.getPlainValueStr()} to ${this.getPlainValueStrObj2()}`;
        };
        break;
      case 'common':
        this.commonObjectPlainStr = commonObjectPlainStr;
        this.getPlainKeyValueStr = function getPlainKeyValueStr() {
          return this.commonObjectPlainStr;
        };
        break;
      default:
        throw new Error(`Unsupported key type: "${keyType}"`);
    }

    // Link plainKeyValue with corresponding comparisonKeyValue
    Object.setPrototypeOf(this, comparisonKeyValue);
  },
};

// Object that converts Comparison object into string using plain format.
// Plain
// {
//    name,
//    added,
//    removed,
//    changed,
//    common,
//    emptySign,
//    commonObjectSign,
//    openObjectStr,
//    closeObjectStr,
//
//    // Sort that will be used to present object keys
//    plainSort(PlainKeyValue, PlainKeyValue),
//
//    // Build full path to the root key
//    getRootFullPath(rootKey, parentKeyPath)
//
//    //Get plain common object key as PlainKeyValue from ComparisonKeyValue
//    getPlainCommonObjectKey(keyType, fullRootKeyPath, comparisonKeyValue, commonObjectPlainStr);
//
//    //Get plain keys as PlainKeyValue array from ComparisonKeyValue Array
//    getPlainKeys(keyType, fullRootKeyPath, comparisonKeyValues)
//
//    // Convert Plain keys into the string
//    getPlainStr([PlainKeyValue]),
//
//    // Convert comparison object into string
//    toString(comparisonObj)
// }
const Plain = {
  name: 'plain',
  added: 'added',
  removed: 'removed',
  changed: 'changed',
  common: 'common',
  plainSort(obj1, obj2) {
    // eslint-disable-next-line max-len
    const obj1Comparator = (obj1.keyIndex.secondIndex === -1) ? obj1.keyIndex.firstIndex : obj1.keyIndex.secondIndex;
    // eslint-disable-next-line max-len
    const obj2Comparator = (obj2.keyIndex.secondIndex === -1) ? obj2.keyIndex.firstIndex : obj2.keyIndex.secondIndex;

    if (obj1Comparator === obj2Comparator) {
      if (obj1.keyName < obj2.keyName) {
        return -1;
      }
      if (obj1.keyName > obj2.keyName) {
        return 1;
      }

      return 0;
    }

    return obj1Comparator - obj2Comparator;
  },
  getRootFullPath(rootKey, parentKeyPath) {
    if (parentKeyPath === null && rootKey === null) {
      return null;
    }

    if (parentKeyPath === null && rootKey !== null) {
      return rootKey.keyName;
    }

    if (parentKeyPath !== null && rootKey !== null) {
      return `${parentKeyPath}.${rootKey.keyName}`;
    }

    throw new Error(`Unsupported combination of parentKeyPath ("${parentKeyPath}") and rootKey ("${rootKey}")`);
  },
  getCommonObjectPlainKey(keyType, fullRootKeyPath, comparisonKeyValue, commonObjectPlainStr) {
    const commonObjPlainKey = Object.create(PlainKeyValue);
    // Path appropriate keyType to add necessary properties into plainKeyValue object
    // link plainKeyValue obj with corresponding comparisonKeyValue obj
    // add commonObjectPlainStr value
    commonObjPlainKey.initPlainKeyValue(
      keyType,
      fullRootKeyPath,
      comparisonKeyValue,
      null,
      commonObjectPlainStr,
    );

    return commonObjPlainKey;
  },
  getPlainKeys(keyType, fullRootKeyPath, comparisonKeyValues) {
    const plainKeyValues = comparisonKeyValues
      .map((comparisonKeyValue) => {
        const plainKeyValueObj = Object.create(PlainKeyValue);
        if (keyType === this.changed) {
          plainKeyValueObj.initPlainKeyValue(
            keyType,
            fullRootKeyPath,
            comparisonKeyValue[0],
            comparisonKeyValue[1],
          );
        } else {
          // Add sign and link plainKeyValue obj with corresponding comparisonKeyValue obj
          plainKeyValueObj.initPlainKeyValue(keyType, fullRootKeyPath, comparisonKeyValue);
        }
        return plainKeyValueObj;
      });

    return plainKeyValues;
  },
  getPlainStr(plainKeyValues) {
    const plainStrArr = plainKeyValues
      .sort(this.plainSort)
      .flatMap((plainKeyValueObj) => plainKeyValueObj.getPlainKeyValueStr());

    return plainStrArr.join('\n');
  },
  toString(comparisonObj, parentKeyPath = null) {
    // Get full path to the root key
    const fullRootKeyPath = this.getRootFullPath(comparisonObj.rootKey, parentKeyPath);

    // Get array of PlainKeyValue object for added ComparisonsKeyValue objects
    const addedPlainKeys = this.getPlainKeys(
      this.added,
      fullRootKeyPath,
      comparisonObj.addedKeys,
    );

    // Get array of PlainKeyValue object for removed ComparisonsKeyValue objects
    const removedPlainKeys = this.getPlainKeys(
      this.removed,
      fullRootKeyPath,
      comparisonObj.removedKeys,
    );

    // Get array of PlainKeyValue object for changed ComparisonsKeyValue objects
    const changedPlainKeys = this.getPlainKeys(
      this.changed,
      fullRootKeyPath,
      comparisonObj.changedKeys,
    );

    const commonObjectPlainKeys = comparisonObj.commonObjectKeys
      .flatMap((comparisonSubObj) => {
        const commonObjectPlainStr = this.toString(comparisonSubObj, fullRootKeyPath);
        // Get Plain common object Key for ComparisonsKeyValue object
        const commonObjectPlainKey = this.getCommonObjectPlainKey(
          this.common,
          fullRootKeyPath,
          comparisonSubObj.rootKey,
          commonObjectPlainStr,
        );

        return commonObjectPlainKey;
      });

    // Get string in plain format for the PlainKeValue objects array
    const plainStr = this.getPlainStr([
      ...addedPlainKeys,
      ...removedPlainKeys,
      ...changedPlainKeys,
      ...commonObjectPlainKeys,
    ]);

    // Build final string
    return plainStr;
  },
};

export default Plain;
