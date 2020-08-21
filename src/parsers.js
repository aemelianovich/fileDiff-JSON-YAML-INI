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
  let parse;
  switch (format.toLowerCase()) {
    case '.json':
      parse = JSON.parse;
      break;
    case '.yml':
    case '.yaml':
      parse = yaml.safeLoad;
      break;
    case '.ini':
      parse = parseINI;
      break;
    default:
      throw new Error(`File format:"${format}" is not supported`);
  }

  const result = parse(data);

  const resultType = typeof (result);

  if (resultType !== 'object') {
    throw new Error(`Result should be an object. Result type: "${resultType}"`);
  }

  return result;
};

export default parseFile;
