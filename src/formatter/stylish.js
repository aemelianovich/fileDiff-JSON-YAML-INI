const Stylish = {
  name: 'stylish',
  objectKeyIndentNum: 4,
  notChangedSign: '  ',
  changedSign: { firstObjSign: '- ', secondObjSign: '+ ' },
  addedSign: '+ ',
  removedSign: '- ',
  emptySign: '',
  childComparisonSign: '',
  stylishArrSort(a, b) {
    // eslint-disable-next-line max-len
    const aComparator = (a.keyIndex.secondKeyIndex === -1) ? a.keyIndex.firstKeyIndex : a.keyIndex.secondKeyIndex;
    // eslint-disable-next-line max-len
    const bComparator = (b.keyIndex.secondKeyIndex === -1) ? b.keyIndex.firstKeyIndex : b.keyIndex.secondKeyIndex;

    if (aComparator === bComparator) {
      if (a.keyName < b.keyName) {
        return -1;
      }
      if (a.keyName > b.keyName) {
        return 1;
      }

      return 0;
    }

    return aComparator - bComparator;
  },
  getStylishKeyValueObj(indentNum, sign, key, value) {
    const stylishKeyValueObj = {
      keyName: key,
      keyIndex: {
        firstKeyIndex: value.firstKeyIndex,
        secondKeyIndex: value.secondKeyIndex,
      },
      keySign: sign,
      keyIndentNum: indentNum,
      get keyIndent() { return ' '.repeat(this.keyIndentNum); },
      get keyStr() {
        return `${' '.repeat(this.keyIndentNum - this.keySign.length)}${this.keySign}${this.keyName}`;
      },
      plainValue: undefined,
      objectValue: undefined,
    };

    if (typeof (value.value) !== 'object') {
      stylishKeyValueObj.plainValue = value.value;
      return stylishKeyValueObj;
    }

    const valueEntries = Object.entries(value.value);
    const valueObject = valueEntries.map((valueEntry) => {
      const keyIndex = valueEntries.indexOf(valueEntry);
      const newObjectKeyIndent = indentNum + this.objectKeyIndentNum;

      const res = this.getStylishKeyValueObj(
        newObjectKeyIndent,
        this.emptySign,
        valueEntry[0],
        {
          firstKeyIndex: keyIndex,
          secondKeyIndex: keyIndex,
          value: valueEntry[1],
        },
      );
      return res;
    });

    stylishKeyValueObj.objectValue = [...valueObject];
    return stylishKeyValueObj;
  },
  getStylishArr(obj, sign, depthLevel) {
    const indentNum = this.objectKeyIndentNum + depthLevel * this.objectKeyIndentNum;
    const stylishArr = [];

    switch (sign) {
      case this.changedSign:
        Object.entries(obj).forEach((el) => {
          stylishArr.push(this.getStylishKeyValueObj(
            indentNum,
            this.changedSign.firstObjSign,
            el[0],
            {
              firstKeyIndex: el[1].firstKeyIndex,
              secondKeyIndex: el[1].secondKeyIndex,
              value: el[1].firstValue,
            },
          ));
          stylishArr.push(this.getStylishKeyValueObj(
            indentNum,
            this.changedSign.secondObjSign,
            el[0],
            {
              firstKeyIndex: el[1].firstKeyIndex,
              secondKeyIndex: el[1].secondKeyIndex,
              value: el[1].secondValue,
            },
          ));
        });
        break;
      case this.addedSign:
      case this.removedSign:
      case this.notChangedSign:
      case this.childComparisonSign:
        Object.entries(obj).forEach((el) => {
          stylishArr.push(this.getStylishKeyValueObj(indentNum, sign, el[0], el[1]));
        });
        break;
      default:
        throw new Error('Undefined sign');
    }
    return stylishArr;
  },
  getStylishStr(stylishArr) {
    const keyValueArr = stylishArr
      .sort(this.stylishArrSort)
      .flatMap((stylishObj) => {
        let keyValueStr;

        if (stylishObj.plainValue === undefined && stylishObj.objectValue === undefined) {
          throw new Error('Either plainValue or objectValue should be defined.');
        } else if (stylishObj.plainValue !== undefined && stylishObj.objectValue !== undefined) {
          throw new Error('Either plainValue or objectValue should be undefined.');
        } else if (stylishObj.plainValue !== undefined) {
          keyValueStr = `${stylishObj.keyStr}: ${stylishObj.plainValue}`;
          return keyValueStr;
        }

        keyValueStr = [
          `${stylishObj.keyStr}: {`,
          this.getStylishStr(stylishObj.objectValue),
          `${stylishObj.keyIndent}}`,
        ].join('\n');

        return keyValueStr;
      });

    const resArr = [...keyValueArr];
    return resArr.join('\n');
  },
  toString(notChangedObj, changedObj, addedObj, removedObj, childComparison, depthLevel) {
    const notChangedStylishArr = this.getStylishArr(notChangedObj, this.notChangedSign, depthLevel);
    const changedStylishArr = this.getStylishArr(changedObj, this.changedSign, depthLevel);
    const addedStylishArr = this.getStylishArr(addedObj, this.addedSign, depthLevel);
    const removedStylishArr = this.getStylishArr(removedObj, this.removedSign, depthLevel);

    const childComparisonStylishArr = Object
      .keys(childComparison)
      .flatMap((comparisonObjKey) => {
        const plainValue = childComparison[comparisonObjKey].toString(Stylish);
        const StylishArr = this.getStylishArr(
          {
            [comparisonObjKey]:
            {
              firstKeyIndex: childComparison[comparisonObjKey].firstKeyIndex,
              secondKeyIndex: childComparison[comparisonObjKey].secondKeyIndex,
              value: plainValue,
            },
          },
          this.childComparisonSign,
          depthLevel,
        );
        return StylishArr;
      });

    return [
      '{',
      this.getStylishStr([
        ...notChangedStylishArr,
        ...changedStylishArr,
        ...addedStylishArr,
        ...removedStylishArr,
        ...childComparisonStylishArr,
      ]),
      `${' '.repeat(depthLevel * this.objectKeyIndentNum)}}`].join('\n');
  },
};

export default Stylish;
