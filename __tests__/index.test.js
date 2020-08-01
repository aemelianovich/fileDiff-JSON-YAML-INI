import { test, expect, beforeEach } from '@jest/globals';
import compareFiles from '../src/index.js';
import { getFixturePath } from '../src/utils.js';

let jsonFilePath1;
let jsonFilePath2;

let yamlFilePath1;
let yamlFilePath2;

let iniFilePath1;
let iniFilePath2;

let comparisonResult;

beforeEach(() => {
  jsonFilePath1 = getFixturePath('file1.json');
  jsonFilePath2 = getFixturePath('file2.json');

  yamlFilePath1 = getFixturePath('file1.yml');
  yamlFilePath2 = getFixturePath('file2.yml');

  iniFilePath1 = getFixturePath('file1.ini');
  iniFilePath2 = getFixturePath('file2.ini');

  comparisonResult = ['{',
    '      host: hexlet.io',
    '    - timeout: 50',
    '    + timeout: 20',
    '    + verbose: true',
    '    - proxy: 123.234.53.22',
    '    - follow: false',
    '}'].join('\n');
});

test('compareFiles(file1, file2): get comparison for plain JSON', () => {
  expect(compareFiles(jsonFilePath1, jsonFilePath2)).toEqual(comparisonResult);
});

test('compareFiles(file1, file2): get comparison for plain YAML', () => {
  expect(compareFiles(yamlFilePath1, yamlFilePath2)).toEqual(comparisonResult);
});

test('compareFiles(file1, file2): get comparison for plain INI', () => {
  expect(compareFiles(iniFilePath1, iniFilePath2)).toEqual(comparisonResult);
});
