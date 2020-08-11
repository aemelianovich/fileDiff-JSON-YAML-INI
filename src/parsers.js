import yaml from 'js-yaml';
import ini from 'ini';

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
      parse = ini.parse;
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
