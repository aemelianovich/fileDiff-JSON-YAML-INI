import Comparison from '../comparison.js';
import Stylish from './stylish.js';
import Plain from './plain.js';
import JsonFormatter from './jsonFormatter.js';

const getFormattedDiffStr = (obj1, obj2, format) => {
  const comparisonObj = Object.create(Comparison);
  comparisonObj.initComparison(obj1, obj2);

  let formattedStr;
  switch (format.toLowerCase()) {
    case 'stylish':
      formattedStr = Stylish.toString(comparisonObj);
      break;
    case 'plain':
      formattedStr = Plain.toString(comparisonObj);
      break;
    case 'json':
      formattedStr = JsonFormatter.toString(comparisonObj);
      break;
    default:
      throw new Error(`Unsupported format: "${format}"`);
  }

  return formattedStr;
};

export default getFormattedDiffStr;
