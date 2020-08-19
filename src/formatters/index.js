import getStylishResult from './stylish.js';
import getPlainResult from './plain.js';
import getJSONResult from './jsonFormatter.js';

const getFormattedDiffStr = (comparisonAST, format) => {
  let formattedStr;
  switch (format.toLowerCase()) {
    case 'stylish':
      formattedStr = getStylishResult(comparisonAST);
      break;
    case 'plain':
      formattedStr = getPlainResult(comparisonAST);
      break;
    case 'json':
      formattedStr = getJSONResult(comparisonAST);
      break;
    default:
      throw new Error(`Unsupported format: "${format}"`);
  }

  return formattedStr;
};

export default getFormattedDiffStr;
