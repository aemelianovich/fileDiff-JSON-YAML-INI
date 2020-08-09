// Object that extends ComparisonKeyValue object to StylishKeyValue format.
// StylishKeyValue
// {
//    keySign,
//    indentNum,
//    commonObjectStylishStr
//    getKeyIndentNum()
//    getKeyIndent(),
//    getKeyStr(),
//    getStylishKeyValueStr(),
//
//    // Assign Stylish properties
//    // Link StylishKeyValue object with particular comparisonKeyValue object
//    initStylishKeyValue(sign, indentNum, comparisonKeyValue, commonObjectStylishStr)
// }
const StylishKeyValue = {
  initStylishKeyValue(sign, indentNum, comparisonKeyValue, commonObjectStylishStr = null) {
    this.keySign = sign;
    this.indentNum = indentNum;
    this.commonObjectStylishStr = commonObjectStylishStr;
    this.getKeyIndentNum = function getKeyIndentNum() {
      return this.indentNum + this.keyDepthLevel * this.indentNum;
    };
    this.getKeyIndent = function getKeyIndent() { return ' '.repeat(this.getKeyIndentNum()); };
    this.getKeyStr = function getKeyStr() {
      return `${' '.repeat(this.getKeyIndentNum() - this.keySign.length)}${this.keySign}${this.keyName}`;
    };
    this.getStylishKeyValueStr = function getStylishKeyValueStr() {
      return `${this.getKeyStr()}: ${this.plainValue}`;
    };
    this.getStylishCommonObjKeyValueStr = function getStylishKeyValueStr() {
      return `${this.getKeyStr()}: ${this.commonObjectStylishStr}`;
    };

    // Link stylishKeyValue with corresponding comparisonKeyValue
    Object.setPrototypeOf(this, comparisonKeyValue);
  },
};

// Object that converts Comparison object into string using stylish format.
// Stylish
// {
//    name,
//    objectKeyIndentNum,
//    addedSign,
//    removedSign,
//    notChangedSign,
//    changedSign: { firstObjSign, secondObjSign }
//    emptySign,
//    commonObjectSign,
//    openObjectStr,
//    closeObjectStr,
//    getCloseObjectStr(),
//
//    //Sort that will be used to present object keys
//    stylishSort(StylishKeyValue, StylishKeyValue),
//
//    //Get stylish common object key as StylishKeyValue from ComparisonKeyValue
//    getStylishCommonObjectKey(comparisonKeyValue, commonObjectValue);
//
//    //Get stylish keys as StylishKeyValue array from ComparisonKeyValue Array
//    getStylishKeys(sign, [comparisonKeyValue])
//
//    // Convert Stylish keys into the string
//    getStylishStr([StylishKeyValue]),
//
//    // Convert comparison object into string
//    toString(comparisonObj)
// }
const Stylish = {
  name: 'stylish',
  objectKeyIndentNum: 4,
  addedSign: '+ ',
  removedSign: '- ',
  notChangedSign: '  ',
  changedSign: { firstObjSign: '- ', secondObjSign: '+ ' },
  emptySign: '',
  commonObjectSign: '',
  openObjectStr: '{',
  closeObjectStr: '}',
  getCloseObjectStr(depthLevel) {
    if (depthLevel === -1) {
      return this.closeObjectStr;
    }

    return `${' '.repeat(this.objectKeyIndentNum + depthLevel * this.objectKeyIndentNum)}${this.closeObjectStr}`;
  },
  stylishSort(obj1, obj2) {
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
  getCommonObjectStylishKey(sign, comparisonKeyValue, commonObjectStylishStr) {
    const commonObjStylishKey = Object.create(StylishKeyValue);
    // Add sign
    // link stylishKeyValue obj with corresponding comparisonKeyValue obj
    // add commonObjectStylishStr value
    commonObjStylishKey.initStylishKeyValue(
      sign,
      this.objectKeyIndentNum,
      comparisonKeyValue,
      commonObjectStylishStr,
    );

    return commonObjStylishKey;
  },
  getStylishKeys(sign, comparisonKeyValues) {
    const stylishKeyValues = comparisonKeyValues
      .map((comparisonKeyValue) => {
        const stylishKeyValueObj = Object.create(StylishKeyValue);
        // Add sign and link stylishKeyValue obj with corresponding comparisonKeyValue obj
        stylishKeyValueObj.initStylishKeyValue(sign, this.objectKeyIndentNum, comparisonKeyValue);
        return stylishKeyValueObj;
      });

    return stylishKeyValues;
  },
  getStylishStr(stylishKeyValues) {
    const stylishStrArr = stylishKeyValues
      .sort(this.stylishSort)
      .flatMap((stylishKeyValueObj) => {
        // Common object Key value
        if (stylishKeyValueObj.commonObjectStylishStr !== null) {
          // Build string for plain key value in stylish format
          return stylishKeyValueObj.getStylishCommonObjKeyValueStr();;
        }

        // Plain key value
        if (stylishKeyValueObj.plainValue === null && stylishKeyValueObj.objectValue === null) {
          throw new Error('Either plainValue or objectValue should be not empty(!null).');
        } else if (stylishKeyValueObj.plainValue !== null
          && stylishKeyValueObj.objectValue !== null) {
          throw new Error('Either plainValue or objectValue should be empty(null).');
        } else if (stylishKeyValueObj.plainValue !== null) {
          // Build string for plain key value in stylish format
          return stylishKeyValueObj.getStylishKeyValueStr();;
        }

        // Object key value
        // Get array of StylishKeyValue object for objects key value in ComparisonKeyValue format
        const stylishObjectValue = this.getStylishKeys(
          this.emptySign,
          stylishKeyValueObj.objectValue,
        );

        const stylishKeyValueStr = [
          `${stylishKeyValueObj.getKeyStr()}: ${this.openObjectStr}`,
          this.getStylishStr(stylishObjectValue),
          `${stylishKeyValueObj.getKeyIndent()}${this.closeObjectStr}`,
        ].join('\n');

        return stylishKeyValueStr;
      });

    return stylishStrArr.join('\n');
  },
  toString(comparisonObj) {
    // Get depth level for the comparisonObj
    const depthLevel = (comparisonObj.rootKey) ? comparisonObj.rootKey.keyDepthLevel : -1;

    // Get array of StylishKeyValue objects for added ComparisonsKeyValue objects
    const addedStylishKeys = this.getStylishKeys(
      this.addedSign,
      comparisonObj.addedKeys,
    );

    // Get array of StylishKeyValue objects for removed ComparisonsKeyValue objects
    const removedStylishKeys = this.getStylishKeys(
      this.removedSign,
      comparisonObj.removedKeys,
    );

    // Get array of StylishKeyValue objects for not changed ComparisonsKeyValue objects
    const notChangedStylishKeys = this.getStylishKeys(
      this.notChangedSign,
      comparisonObj.notChangedPlainKeys,
    );

    // Get array of StylishKeyValue objects for changed ComparisonsKeyValue objects
    // Object 1
    const changedKeysObj1 = comparisonObj.changedKeys
      .map((changedKeyValueObjects) => changedKeyValueObjects[0]);

    const changedStylishKeysObj1 = this.getStylishKeys(
      this.changedSign.firstObjSign,
      changedKeysObj1,
    );
    // Object 2
    const changedKeysObj2 = comparisonObj.changedKeys
      .map((changedKeyValueObjects) => changedKeyValueObjects[1]);

    const changedStylishKeysObj2 = this.getStylishKeys(
      this.changedSign.secondObjSign,
      changedKeysObj2,
    );

    const commonObjectStylishKeys = comparisonObj.commonObjectKeys
      .flatMap((comparisonSubObj) => {
        const commonObjectStylishStr = this.toString(comparisonSubObj);
        // Get Stylish common object Key for ComparisonsKeyValue object
        const commonObjectStylishKey = this.getCommonObjectStylishKey(
          this.commonObjectSign,
          comparisonSubObj.rootKey,
          commonObjectStylishStr,
        );

        return commonObjectStylishKey;
      });

    // Get string in stylish format for the StylishKeValue objects array
    const stylishStr = this.getStylishStr([
      ...addedStylishKeys,
      ...removedStylishKeys,
      ...notChangedStylishKeys,
      ...changedStylishKeysObj1,
      ...changedStylishKeysObj2,
      ...commonObjectStylishKeys,
    ]);

    // Build final string
    return [
      this.openObjectStr,
      stylishStr,
      this.getCloseObjectStr(depthLevel)].join('\n');
  },
};

export default Stylish;
