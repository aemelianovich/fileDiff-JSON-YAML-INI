const JsonFormatter = {
  toString(comparisonObj) {
    const jsonStr = JSON.stringify(comparisonObj, null, 2);

    return jsonStr;
  },
};

export default JsonFormatter;
