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
  const fileTypes = [
    'json',
    'ini',
    'yaml',
  ];

  const stylishResult = readFixture('stylish.txt');
  const plainResult = readFixture('plain.txt');
  const jsonResult = readFixture('json.json');

  test.each(fileTypes)('Test genDiff for fileType = %p', (fileType) => {
    const filePath1 = getFixturePath(`file1.${fileType}`);
    const filePath2 = getFixturePath(`file2.${fileType}`);

    expect(genDiff(filePath1, filePath2, 'stylish')).toEqual(stylishResult);
    expect(genDiff(filePath1, filePath2, 'plain')).toEqual(plainResult);
    expect(genDiff(filePath1, filePath2, 'json')).toEqual(jsonResult);
  });
});
