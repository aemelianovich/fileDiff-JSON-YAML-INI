import _ from 'lodash';

const Comparison = {
  initComparison(obj1, obj2, depthLevel = 0, firstKeyIndex = -1, secondKeyIndex = -1) {
    this.depthLevel = depthLevel;
    this.firstKeyIndex = firstKeyIndex;
    this.secondKeyIndex = secondKeyIndex;
    this.notChanged = {};
    this.changed = {};
    this.added = {};
    this.removed = {};
    this.childComparison = {};

    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);

    // Populate added keys
    const addedKeys = _.difference(obj2Keys, obj1Keys);
    addedKeys.forEach((el) => {
      this.added[el] = {
        firstKeyIndex: -1,
        secondKeyIndex: obj2Keys.indexOf(el),
        value: obj2[el],
      };
    });

    // Populate removed keys
    const removedKeys = _.difference(obj1Keys, obj2Keys);
    removedKeys.forEach((el) => {
      this.removed[el] = {
        firstKeyIndex: obj1Keys.indexOf(el),
        secondKeyIndex: -1,
        value: obj1[el],
      };
    });

    // Populate notChanged and changed keys
    const commonKeys = _.intersection(obj1Keys, obj2Keys);
    commonKeys.forEach((el) => {
      if (typeof (obj1[el]) === 'object' && typeof (obj2[el]) === 'object') {
        const childComparisonObj = Object.create(Comparison);
        childComparisonObj.initComparison(
          obj1[el],
          obj2[el],
          this.depthLevel + 1,
          obj1Keys.indexOf(el),
          obj2Keys.indexOf(el),
        );
        this.childComparison[el] = childComparisonObj;
      } else if (obj1[el] === obj2[el]) {
        this.notChanged[el] = {
          firstKeyIndex: obj1Keys.indexOf(el),
          secondKeyIndex: obj2Keys.indexOf(el),
          value: obj2[el],
        };
      } else {
        this.changed[el] = {
          firstKeyIndex: obj1Keys.indexOf(el),
          secondKeyIndex: obj2Keys.indexOf(el),
          firstValue: obj1[el],
          secondValue: obj2[el],
        };
      }
    });
  },
  defaultFormat: {
    name: 'default',
    toString(notChanged, changed, added, removed, childComparison, depthLevel) {
      const indent = ' '.repeat(depthLevel * 2);

      const strArr = [
        `${indent}notChanged:`,
        `${indent}${JSON.stringify(notChanged)}`,
        `${indent}changed:`,
        `${indent}${JSON.stringify(changed)}`,
        `${indent}added:`,
        `${indent}${JSON.stringify(added)}`,
        `${indent}removed:`,
        `${indent}${JSON.stringify(removed)}`,
      ];

      strArr.push(`${indent}childComparison:`);
      const childComparisonKeys = Object.keys(childComparison);
      if (childComparisonKeys.length === 0) {
        strArr.push(`${indent}{}`);
      } else {
        childComparisonKeys.forEach((el) => {
          strArr.push(`${indent}${el}:`);
          strArr.push(childComparison[el].toString());
        });
      }

      return strArr.join('\n');
    },
  },

  toString(format = this.defaultFormat) {
    const str = format.toString(
      this.notChanged,
      this.changed,
      this.added,
      this.removed,
      this.childComparison,
      this.depthLevel,
    );

    return str;
  },
};

export default Comparison;
