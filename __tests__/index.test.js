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

  test.each(fileTypes)('Test genDiff for fileType = %p', (fileType) => {
    const styleFormats = [
      'stylish',
      'plain',
      'json',
    ];

    const filePath1 = getFixturePath(`file1.${fileType}`);
    const filePath2 = getFixturePath(`file2.${fileType}`);

    styleFormats.forEach((format) => {
      let expectedDiff;
      switch (format) {
        case 'json':
          expectedDiff = readFixture(`${format}.json`);
          break;
        default:
          expectedDiff = readFixture(`${format}.txt`);
      }

      expect(genDiff(
        filePath1,
        filePath2,
        format,
      )).toEqual(expectedDiff);
    });
  });
});
