import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const readFile = (filePath) => {
  const resolvedPath = path.resolve(filePath);
  const fileData = fs.readFileSync(resolvedPath, 'utf-8');

  return fileData;
};

export {
  getFixturePath,
  readFixture,
  readFile,
};
