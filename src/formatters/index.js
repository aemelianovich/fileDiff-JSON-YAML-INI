import getStylishResult from './stylish.js';
import getPlainResult from './plain.js';
import getJSONResult from './jsonFormatter.js';

const getFormattedDiffStr = (comparisonAST, format) => {
  switch (format.toLowerCase()) {
    case 'stylish':
      return getStylishResult(comparisonAST);
    case 'plain':
      return getPlainResult(comparisonAST);
    case 'json':
      return getJSONResult(comparisonAST);
    default:
      throw new Error(`Unsupported format: "${format}"`);
  }
};

export default getFormattedDiffStr;
