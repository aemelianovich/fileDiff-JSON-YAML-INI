// Object that extends ComparisonKeyValue object to PlainKeyValue format.
// PlainKeyValue
// {
//    objectKeyIndentNum,
//    keySign,
//    get keyIndentNum()
//    get KeyIndent(),
//    get KeyStr(),
//
//    // Assign Plain properties
//    // Link PlainKeyValue object with particular comparisonKeyValue object
//    initPlainKeyValue(sign, indentNum, comparisonKeyValue, commonObjectPlainStr)
// }
const PlainKeyValue = {
  initPlainKeyValue(sign, indentNum, comparisonKeyValue, commonObjectPlainStr = null) {
    this.keySign = sign;
    this.indentNum = indentNum;
    this.commonObjectPlainStr = commonObjectPlainStr;
    this.getKeyIndentNum = function getKeyIndentNum() {
      return this.indentNum + this.keyDepthLevel * this.indentNum;
    };
    this.getKeyIndent = function getKeyIndent() { return ' '.repeat(this.getKeyIndentNum()); };
    this.getKeyStr = function getKeyStr() {
      return `${' '.repeat(this.getKeyIndentNum() - this.keySign.length)}${this.keySign}${this.keyName}`;
    };

    // Link plainKeyValue with corresponding comparisonKeyValue
    Object.setPrototypeOf(this, comparisonKeyValue);
  },
};

// Object that converts Comparison object into string using plain format.
// Plain
// {
//    name,
//    addedSign,
//    removedSign,
//    notChangedSign,
//    changedSign: { firstObjSign, secondObjSign }
//    emptySign,
//    commonObjectSign,
//    openObjectStr,
//    closeObjectStr,
//
//    //Sort that will be used to present object keys
//    plainArrSort(PlainKeyValue, PlainKeyValue),
//
//    //Get plain common object key as PlainKeyValue from ComparisonKeyValue
//    getPlainCommonObjectKey(comparisonKeyValue, commonObjectValue);
//
//    //Get plain keys as PlainKeyValue array from ComparisonKeyValue Array
//    getPlainKeys(sign, [comparisonKeyValue])
//
//    // Convert Plain keys into the string
//    getPlainStr([PlainKeyValue]),
//
//    // Convert comparison object into string
//    toString(comparisonObj)
// }
const Plain = {
  name: 'plain',
  objectKeyIndentNum: 4,
  notChangedSign: '  ',
  changedSign: { firstObjSign: '- ', secondObjSign: '+ ' },
  addedSign: '+ ',
  removedSign: '- ',
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
  getCommonObjectPlainKey(sign, comparisonKeyValue, commonObjectPlainStr) {
    const commonObjPlainKey = Object.create(PlainKeyValue);
    // Add sign
    // link plainKeyValue obj with corresponding comparisonKeyValue obj
    // add commonObjectPlainStr value
    commonObjPlainKey.initPlainKeyValue(
      sign,
      this.objectKeyIndentNum,
      comparisonKeyValue,
      commonObjectPlainStr,
    );

    return commonObjPlainKey;
  },
  getPlainKeys(sign, comparisonKeyValues) {
    const plainKeyValues = comparisonKeyValues
      .map((comparisonKeyValue) => {
        const plainKeyValueObj = Object.create(PlainKeyValue);
        // Add sign and link plainKeyValue obj with corresponding comparisonKeyValue obj
        plainKeyValueObj.initPlainKeyValue(sign, this.objectKeyIndentNum, comparisonKeyValue);
        return plainKeyValueObj;
      });

    return plainKeyValues;
  },
  getPlainStr(plainKeyValues) {
    const plainStrArr = plainKeyValues
      .sort(this.plainSort)
      .flatMap((plainKeyValueObj) => {
        let plainKeyValueStr;

        // Common object Key value
        if (plainKeyValueObj.commonObjectPlainStr !== null) {
          // Build string for plain key value in plain format
          plainKeyValueStr = `${plainKeyValueObj.getKeyStr()}: ${plainKeyValueObj.commonObjectPlainStr}`;
          return plainKeyValueStr;
        }

        // Plain key value
        if (plainKeyValueObj.plainValue === null && plainKeyValueObj.objectValue === null) {
          throw new Error('Either plainValue or objectValue should be not empty(!null).');
        } else if (plainKeyValueObj.plainValue !== null
          && plainKeyValueObj.objectValue !== null) {
          throw new Error('Either plainValue or objectValue should be empty(null).');
        } else if (plainKeyValueObj.plainValue !== null) {
          // Build string for plain key value in plain format
          plainKeyValueStr = `${plainKeyValueObj.getKeyStr()}: ${plainKeyValueObj.plainValue}`;
          return plainKeyValueStr;
        }

        // Object key value
        // Get array of PlainKeyValue object for objects key value in ComparisonKeyValue format
        const plainObjectValue = this.getPlainKeys(
          this.emptySign,
          plainKeyValueObj.objectValue,
        );

        plainKeyValueStr = [
          `${plainKeyValueObj.getKeyStr()}: ${this.openObjectStr}`,
          this.getPlainStr(plainObjectValue),
          `${plainKeyValueObj.getKeyIndent()}${this.closeObjectStr}`,
        ].join('\n');

        return plainKeyValueStr;
      });

    const resArr = [...plainStrArr];
    return resArr.join('\n');
  },
  toString(comparisonObj) {
    // Get depth level for the comparisonObj
    const depthLevel = (comparisonObj.rootKey) ? comparisonObj.rootKey.keyDepthLevel : -1;

    // Get array of PlainKeyValue object for added ComparisonsKeyValue objects
    const addedPlainKeys = this.getPlainKeys(
      this.addedSign,
      comparisonObj.addedKeys,
    );

    // Get array of PlainKeyValue object for removed ComparisonsKeyValue objects
    const removedPlainKeys = this.getPlainKeys(
      this.removedSign,
      comparisonObj.removedKeys,
    );

    // Get array of PlainKeyValue object for not changed ComparisonsKeyValue objects
    const notChangedPlainKeys = this.getPlainKeys(
      this.notChangedSign,
      comparisonObj.notChangedPlainKeys,
    );

    // Get array of PlainKeyValue object for changed ComparisonsKeyValue objects
    // Object 1
    const changedKeysObj1 = comparisonObj.changedKeys
      .map((changedKeyValueObjects) => changedKeyValueObjects[0]);

    const changedPlainKeysObj1 = this.getPlainKeys(
      this.changedSign.firstObjSign,
      changedKeysObj1,
    );

    const changedKeysObj2 = comparisonObj.changedKeys
      .map((changedKeyValueObjects) => changedKeyValueObjects[1]);

    const changedPlainKeysObj2 = this.getPlainKeys(
      this.changedSign.secondObjSign,
      changedKeysObj2,
    );

    const commonObjectPlainKeys = comparisonObj.commonObjectKeys
      .flatMap((comparisonSubObj) => {
        const commonObjectPlainStr = this.toString(comparisonSubObj);
        // Get Plain common object Key for ComparisonsKeyValue object
        const commonObjectPlainKey = this.getCommonObjectPlainKey(
          this.commonObjectSign,
          comparisonSubObj.rootKey,
          commonObjectPlainStr,
        );

        return commonObjectPlainKey;
      });

    // Get string in plain format for the PlainKeValue objects array
    const plainStr = this.getPlainStr([
      ...addedPlainKeys,
      ...removedPlainKeys,
      ...notChangedPlainKeys,
      ...changedPlainKeysObj1,
      ...changedPlainKeysObj2,
      ...commonObjectPlainKeys,
    ]);

    // Build final string
    return [
      this.openObjectStr,
      plainStr,
      this.getCloseObjectStr(depthLevel)].join('\n');
  },
};

export default Plain;
