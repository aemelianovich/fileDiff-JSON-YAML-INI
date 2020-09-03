import formatStylish from './stylish.js';
import formatPlain from './plain.js';

const format = (diff, formatType) => {
  switch (formatType.toLowerCase()) {
    case 'stylish':
      return formatStylish(diff);
    case 'plain':
      return formatPlain(diff);
    case 'json':
      return JSON.stringify(diff);
    default:
      throw new Error(`Unsupported format: "${formatType}"`);
  }
};

export default format;
