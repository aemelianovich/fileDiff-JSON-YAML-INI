import _ from 'lodash';

const Comparison = {
  emptySign: ' ',
  addedSign: '+',
  removedSign: '-',
  initComparison(obj1, obj2) {
    this.addedObj = {};
    this.removedObj = {};
    this.notChangedObj = {};
    this.changedObj = {};

    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);

    // Populate added keys
    const addedKeys = _.difference(obj2Keys, obj1Keys);
    addedKeys.forEach((el) => { this.addedObj[el] = obj2[el]; });

    // Populate removed keys
    const removedKeys = _.difference(obj1Keys, obj2Keys);
    removedKeys.forEach((el) => { this.removedObj[el] = obj1[el]; });

    // Populate notChanged and changed keys
    const commonKeys = _.intersection(obj1Keys, obj2Keys);
    commonKeys.forEach((el) => {
      if (obj1[el] === obj2[el]) {
        this.notChangedObj[el] = obj2[el];
      } else {
        this.changedObj[el] = [obj1[el], obj2[el]];
      }
    });
  },
  toStringKeyValue(indentNum, sign, key, value) {
    return `${' '.repeat(indentNum)}${sign} ${key}: ${value}`;
  },
  toStringObj(obj) {
    const strArr = [];
    if (obj === this.changedObj) {
      Object.entries(obj).forEach((el) => {
        strArr.push(this.toStringKeyValue(4, this.removedSign, el[0], el[1][0]));
        strArr.push(this.toStringKeyValue(4, this.addedSign, el[0], el[1][1]));
      });
    } else {
      let sign;
      switch (obj) {
        case this.addedObj:
          sign = this.addedSign;
          break;
        case this.removedObj:
          sign = this.removedSign;
          break;
        case this.notChangedObj:
          sign = this.emptySign;
          break;
        default:
          throw new Error('Undefined object');
      }

      Object.entries(obj).forEach((el) => {
        strArr.push(this.toStringKeyValue(4, sign, el[0], el[1]));
      });
    }

    return strArr.join('\n');
  },
  toString() {
    const strArr = ['{'];

    strArr.push(this.toStringObj(this.notChangedObj));
    strArr.push(this.toStringObj(this.changedObj));
    strArr.push(this.toStringObj(this.addedObj));
    strArr.push(this.toStringObj(this.removedObj));

    strArr.push('}');

    return strArr.join('\n');
  },
};

export default Comparison;
