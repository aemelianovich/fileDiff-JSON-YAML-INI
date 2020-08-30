import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const isNumber = (value) => (_.toNumber(value) && typeof (value) === 'string');

const castStringToNumber = (obj) => {
  const convertedObj = _.mapValues(obj, (value) => {
    if (isNumber(value)) {
      return _.toNumber(value);
    }

    if (_.isObject(value)) {
      return castStringToNumber(value);
    }

    return value;
  });

  return convertedObj;
};

const parseINI = (data) => {
  const obj = ini.parse(data);
  return castStringToNumber(obj);
};

const parseData = (data, format) => {
  switch (format.toLowerCase()) {
    case 'json':
      return JSON.parse(data);
    case 'yml':
    case 'yaml':
      return yaml.safeLoad(data);
    case 'ini':
      return parseINI(data);
    default:
      throw new Error(`Data format:"${format}" is not supported`);
  }
};

export default parseData;
