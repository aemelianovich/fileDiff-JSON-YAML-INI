import getStylishOutput from './stylish.js';
import getPlainOutput from './plain.js';

const getFormattedOutput = (diffAST, format) => {
  switch (format.toLowerCase()) {
    case 'stylish':
      return getStylishOutput(diffAST);
    case 'plain':
      return getPlainOutput(diffAST);
    case 'json':
      return JSON.stringify(diffAST);
    default:
      throw new Error(`Unsupported format: "${format}"`);
  }
};

export default getFormattedOutput;
