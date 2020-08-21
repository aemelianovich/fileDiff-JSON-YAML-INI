import { test, expect, describe } from '@jest/globals';
import genDiff from '../src/index.js';
import { getFixturePath, readFixture } from '../src/utils.js';

describe('Test genDiff for different styles', () => {
  const fileFormats = [
    'json',
    'ini',
    'yaml',
  ];
  const styleFormats = [
    'stylish',
    'plain',
    'json',
  ];

  const inputTestParams = fileFormats.reduce((acc, fileFormat) => {
    const fileTests = styleFormats.map((styleFormat) => {
      const filePath1 = getFixturePath(`index_files/${fileFormat}_complex_file1.${fileFormat}`);
      const filePath2 = getFixturePath(`index_files/${fileFormat}_complex_file2.${fileFormat}`);
      const result = readFixture(`index_files/${styleFormat}_complex_result.txt`);
      return [filePath1, filePath2, styleFormat, result];
    });
    return [...acc, ...fileTests];
  }, []);

  test.each(inputTestParams)(`Test genDiff with params:
  filePath1 = %p, 
  filePath2 = %p,
  format = %p`, (filePath1, filePath2, format, result) => {
    expect(genDiff(
      filePath1,
      filePath2,
      format,
    )).toEqual(result);
  });
});
