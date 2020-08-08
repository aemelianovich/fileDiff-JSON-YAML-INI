import Stylish from './stylish.js';
import Plain from './plain.js';

const getFormattedStr = (comparisonObj, format) => {
  let formattedStr;
  switch (format.toLowerCase()) {
    case 'stylish':
      formattedStr = Stylish.toString(comparisonObj);
      break;
    case 'plain':
      formattedStr = Plain.toString(comparisonObj);
      break;
    default:
      throw new Error(`Unsupported format: "${format}"`);
  }

  return formattedStr;
};

export default getFormattedStr;
