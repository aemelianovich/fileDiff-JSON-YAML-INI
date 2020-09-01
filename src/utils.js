import path from 'path';
import fs from 'fs';

const readFile = (filePath) => {
  const resolvedPath = path.resolve(filePath);
  const fileData = fs.readFileSync(resolvedPath, 'utf-8');

  return fileData;
};

const getFileDataFormat = (filePath) => path.extname(filePath).substr(1);

// eslint-disable-next-line import/prefer-default-export
export { readFile, getFileDataFormat };
