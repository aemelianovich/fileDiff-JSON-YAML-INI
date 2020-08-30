import { test, expect, describe } from '@jest/globals';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('Test genDiff for different styles', () => {
  const styleFormats = [
    'stylish',
    'plain',
    'json',
  ];

  const fileExtensions = [
    '.json',
    '.ini',
    '.yaml',
  ];

  const inputTestParams = styleFormats.reduce((acc, styleFormat) => {
    const styleInputParams = fileExtensions.map((fileExtension) => [styleFormat, fileExtension]);
    return [...acc, ...styleInputParams];
  }, []);

  test.each(inputTestParams)(`Test genDiff with params:
  format = %p, 
  fileExtension = %p`, (format, fileExt) => {
    const filePath1 = getFixturePath(`file1${fileExt}`);
    const filePath2 = getFixturePath(`file2${fileExt}`);
    const expectedDiff = readFixture(`${format}.txt`);

    expect(genDiff(
      filePath1,
      filePath2,
      format,
    )).toEqual(expectedDiff);
  });
});
