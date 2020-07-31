import _ from 'lodash';

const comparisonObj = {
  equalSign: ' ',
  addedSign: '+',
  removedSign: '-',
  addValue(value) {
    return ((typeof (value) === 'object') ? JSON.parse(JSON.stringify(value)) : value);
  },
  initComparisonObject(obj1, obj2) {
    this.addedObj = {};
    this.removedObj = {};
    this.notChangedObj = {};
    this.changedObj = {};

    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);

    // Populate added key
    const addedKeys = _.difference(obj2Keys, obj1Keys);
    addedKeys.forEach((el) => { this.addedObj[el] = this.addValue(obj2[el]); });

    // Populate removed key
    const removedKeys = _.difference(obj1Keys, obj2Keys);
    removedKeys.forEach((el) => { this.removedObj[el] = this.addValue(obj1[el]); });

    // Populate notChanged and changed keys
    const commonKeys = _.intersection(obj1Keys, obj2Keys);
    commonKeys.forEach((el) => {
      if (obj1[el] === obj2[el]) {
        this.notChangedObj[el] = this.addValue(obj2[el]);
      } else {
        this.changedObj[el] = [this.addValue(obj2[el]), this.addValue(obj1[el])];
      }
    });
  },
  toStringKeyValue(indentNum, sign, key, value) {
    return `${' '.repeat(indentNum)}${sign} ${key}: ${value}`;
  },
  toString() {
    const strArr = ['{'];

    // Add notChanged key:values
    Object.entries(this.notChangedObj).forEach((el) => {
      strArr.push(this.toStringKeyValue(4, this.equalSign, el[0], el[1]));
    });

    // Add changed key:values
    Object.entries(this.changedObj).forEach((el) => {
      strArr.push(this.toStringKeyValue(4, this.addedSign, el[0], el[1][0]));
      strArr.push(this.toStringKeyValue(4, this.removedSign, el[0], el[1][0]));
    });

    // Add added key:values
    Object.entries(this.addedObj).forEach((el) => {
      strArr.push(this.toStringKeyValue(4, this.addedSign, el[0], el[1]));
    });

    // Add removed key:values
    Object.entries(this.removedObj).forEach((el) => {
      strArr.push(this.toStringKeyValue(4, this.removedSign, el[0], el[1]));
    });

    strArr.push('}');

    return strArr.join('\n');
  },
};

export default comparisonObj;
