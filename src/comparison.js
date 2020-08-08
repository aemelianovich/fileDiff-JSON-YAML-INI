import _ from 'lodash';

// Object that describes particular key value pair which is result of two object comparison.
// ComparisonKeyValue
// {
//    keyName,
//    keyIndex: {
//      firstIndex,   // index of the key from the first object (-1 for undefined).
//      secondIndex}, // index of the key from the second object (-1 for undefined).
//    keyDepthLevel,
//    plainValue,
//    objectValue: [ComparisonKeyValue]
// }
const ComparisonKeyValue = {
  initComparisonKeyValue(key, firstKeyIndex, secondKeyIndex, depthLevel, value) {
    this.keyName = key;
    this.keyIndex = { firstIndex: firstKeyIndex, secondIndex: secondKeyIndex };
    this.keyDepthLevel = depthLevel;

    // Init value:
    if (value === null) {
      this.plainValue = null;
      this.objectValue = null;
    // plain value
    } else if (typeof (value) !== 'object') {
      this.plainValue = value;
      this.objectValue = null;
    // object Value
    } else {
      this.plainValue = null;

      // Each object key and value we have to describe in ComparisonKeyValue object
      const valueEntries = Object.entries(value);
      const comparisonKeyValues = valueEntries
        .map((valueEntry) => {
          // Create comparisonKeyValue object for particular key value pair of the objectValue
          const comparisonKeyValueObj = Object.create(ComparisonKeyValue);

          const keyIndex = valueEntries.indexOf(valueEntry);
          const keyDepth = depthLevel + 1;

          comparisonKeyValueObj.initComparisonKeyValue(
            // a key of objectValue
            valueEntry[0],
            // firstKeyIndex and secondKeyIndex are identical
            keyIndex,
            keyIndex,
            keyDepth,
            // a value of objectValue
            valueEntry[1],
          );

          return comparisonKeyValueObj;
        });

      this.objectValue = comparisonKeyValues;
    }
  },
};

// Object that describes result of two object comparison.
// Comparison
// {
//    // Description of the root comparison key (null default root)
//    rootKey: ComparisonKeyValue
//
//    // For storing keys that were added
//    addedKeys: [ComparisonKeyValue],
//
//    // For storing keys that were removed
//    removedKeys: [ComparisonKeyValue],
//
//    // For storing plain keys that weren't changed
//    notChangedPlainKeys: [ComparisonKeyValue],
//
//    // For storing keys that were changed (at least one plain key)
//    changedKeys: [ComparisonKeyValue],
//
//    //For storing result of comparison for common object keys (Both keys should be objects)
//    commonObjectKeys: [Comparison],
// }
const Comparison = {
  initComparison(obj1, obj2, depthLevel = 0, rootKeyObj = null) {
    // Init root comparison key
    this.rootKey = rootKeyObj;

    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);

    // Init added keys as ComparisonKeyValue
    this.addedKeys = _.difference(obj2Keys, obj1Keys)
      .map((addedKey) => {
        const addedKeyObj = Object.create(ComparisonKeyValue);
        addedKeyObj.initComparisonKeyValue(
          addedKey,
          -1,
          obj2Keys.indexOf(addedKey),
          depthLevel,
          obj2[addedKey],
        );

        return addedKeyObj;
      });

    // Init removed keys as ComparisonKeyValue
    this.removedKeys = _.difference(obj1Keys, obj2Keys)
      .map((removedKey) => {
        const removedKeyObj = Object.create(ComparisonKeyValue);
        removedKeyObj.initComparisonKeyValue(
          removedKey,
          obj1Keys.indexOf(removedKey),
          -1,
          depthLevel,
          obj1[removedKey],
        );

        return removedKeyObj;
      });

    const commonKeys = _.intersection(obj1Keys, obj2Keys);
    const commonKeysWithPlainKey = commonKeys
      .filter((commonKey) => (typeof (obj1[commonKey]) !== 'object' || typeof (obj2[commonKey]) !== 'object'));

    // Init notChanged plain keys as ComparisonKeyValue
    this.notChangedPlainKeys = commonKeysWithPlainKey
      .filter((commonKey) => (obj1[commonKey] === obj2[commonKey]))
      .map((notChangedPlainKey) => {
        const notChangedPlainObj = Object.create(ComparisonKeyValue);
        notChangedPlainObj.initComparisonKeyValue(
          notChangedPlainKey,
          obj1Keys.indexOf(notChangedPlainKey),
          obj2Keys.indexOf(notChangedPlainKey),
          depthLevel,
          obj2[notChangedPlainKey],
        );

        return notChangedPlainObj;
      });

    // Init changed keys (with at least one plain key) as ComparisonKeyValue
    this.changedKeys = commonKeysWithPlainKey
      .filter((commonKey) => (obj1[commonKey] !== obj2[commonKey]))
      .map((changedKey) => {
        const changedObj1 = Object.create(ComparisonKeyValue);
        changedObj1.initComparisonKeyValue(
          changedKey,
          obj1Keys.indexOf(changedKey),
          obj2Keys.indexOf(changedKey),
          depthLevel,
          obj1[changedKey],
        );

        const changedObj2 = Object.create(ComparisonKeyValue);
        changedObj2.initComparisonKeyValue(
          changedKey,
          obj1Keys.indexOf(changedKey),
          obj2Keys.indexOf(changedKey),
          depthLevel,
          obj2[changedKey],
        );

        return [changedObj1, changedObj2];
      });

    // Init common object keys (both keys should be objects) as Comparison
    this.commonObjectKeys = commonKeys
      .filter((commonKey) => (typeof (obj1[commonKey]) === 'object' && typeof (obj2[commonKey]) === 'object'))
      .map((commonObjectKey) => {
        // Describe comparison root key object as ComparisonKeyValue with null values
        // Values for comparison object will be added into the:
        // addedKeys, removedKeys, notChangedPlainKeys, changedKeys, commonObjectKeys

        const comparisonRootKeyObj = Object.create(ComparisonKeyValue);
        comparisonRootKeyObj.initComparisonKeyValue(
          commonObjectKey,
          obj1Keys.indexOf(commonObjectKey),
          obj2Keys.indexOf(commonObjectKey),
          depthLevel,
          null,
        );

        const comparisonObj = Object.create(Comparison);
        comparisonObj.initComparison(
          obj1[commonObjectKey],
          obj2[commonObjectKey],
          depthLevel + 1,
          comparisonRootKeyObj,
        );
        return comparisonObj;
      });
  },
};

export default Comparison;
