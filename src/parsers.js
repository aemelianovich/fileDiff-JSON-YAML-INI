import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const convertStringToNumber = (value) => {
  if (typeof (value) === 'string' && _.toNumber(value)) {
    return _.toNumber(value);
  }

  return value;
};

const convertObjValuesStringToNumber = (obj) => {
  const objEntries = Object.entries(obj);
  const convertedObj = objEntries
    .reduce((acc, [key, val]) => {
      const newObj = {};
      if (_.isObject(val)) {
        newObj[key] = convertObjValuesStringToNumber(val);
      } else {
        newObj[key] = convertStringToNumber(val);
      }

      return { ...acc, ...newObj };
    }, {});

  return convertedObj;
};

const parseINI = (data) => {
  const obj = ini.parse(data);
  return convertObjValuesStringToNumber(obj);
};

const parseFile = (data, format) => {
  switch (format.toLowerCase()) {
    case '.json':
      return JSON.parse(data);
    case '.yml':
    case '.yaml':
      return yaml.safeLoad(data);
    case '.ini':
      return parseINI(data);
    default:
      throw new Error(`File format:"${format}" is not supported`);
  }
};

export default parseFile;
