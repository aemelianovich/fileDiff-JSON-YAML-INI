import { test, expect, describe } from '@jest/globals';
import genDiff from '../src/index.js';
import { getFixturePath, readFixture } from '../src/utils.js';

describe('Test genDiff for different styles', () => {
  // JSON
  const jsonComplexObjFilePath1 = getFixturePath('index_files/json_complex_file1.json');
  const jsonComplexObjFilePath2 = getFixturePath('index_files/json_complex_file2.json');

  // YAML
  const yamlComplexObjFilePath1 = getFixturePath('index_files/yaml_complex_file1.yml');
  const yamlComplexObjFilePath2 = getFixturePath('index_files/yaml_complex_file2.yml');

  // INI
  const iniComplexObjFilePath1 = getFixturePath('index_files/ini_complex_file1.ini');
  const iniComplexObjFilePath2 = getFixturePath('index_files/ini_complex_file2.ini');

  // Formats
  const stylishFormat = 'stylish';
  const plainFormat = 'plain';
  const jsonFormat = 'json';

  // Results
  const stylishComplexResult = readFixture('index_files/stylish_complex_result.txt');
  const plainComplexResult = readFixture('index_files/plain_complex_result.txt');
  const jsonFormattedComplexResult = readFixture('index_files/json_formatter_complex_result.txt');

  test.each([
    [
      jsonComplexObjFilePath1,
      jsonComplexObjFilePath2,
      stylishFormat,
      stylishComplexResult,
    ],
    [
      yamlComplexObjFilePath1,
      yamlComplexObjFilePath2,
      stylishFormat,
      stylishComplexResult,
    ],
    [
      iniComplexObjFilePath1,
      iniComplexObjFilePath2,
      stylishFormat,
      stylishComplexResult,
    ],
    [
      jsonComplexObjFilePath1,
      jsonComplexObjFilePath2,
      plainFormat,
      plainComplexResult,
    ],
    [
      yamlComplexObjFilePath1,
      yamlComplexObjFilePath2,
      plainFormat,
      plainComplexResult,
    ],
    [
      iniComplexObjFilePath1,
      iniComplexObjFilePath2,
      plainFormat,
      plainComplexResult,
    ],
    [
      jsonComplexObjFilePath1,
      jsonComplexObjFilePath2,
      jsonFormat,
      jsonFormattedComplexResult,
    ],
    [
      yamlComplexObjFilePath1,
      yamlComplexObjFilePath2,
      jsonFormat,
      jsonFormattedComplexResult,
    ],
    [
      iniComplexObjFilePath1,
      iniComplexObjFilePath2,
      jsonFormat,
      jsonFormattedComplexResult,
    ],
  ])(`Test genDiff with params:
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
