const getJSONResult = (comparisonAST) => {
  const jsonStr = JSON.stringify(comparisonAST, null, 2);

  return jsonStr;
};

export default getJSONResult;
