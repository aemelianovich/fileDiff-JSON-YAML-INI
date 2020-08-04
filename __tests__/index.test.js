import { test, expect, beforeEach } from '@jest/globals';
import compareFiles from '../src/index.js';
import { getFixturePath, readFixture } from '../src/utils.js';

// JSON
let jsonPlainObjFilePath1;
let jsonPlainObjFilePath2;

let jsonComplexObjFilePath1;
let jsonComplexObjFilePath2;

// YAML
let yamlPlainObjFilePath1;
let yamlPlainObjFilePath2;

// INI
let iniPlainObjFilePath1;
let iniPlainObjFilePath2;

let comparisonResult;
let comparisonComplexResult;

beforeEach(() => {
  // JSON
  jsonPlainObjFilePath1 = getFixturePath('file1PlainObject.json');
  jsonPlainObjFilePath2 = getFixturePath('file2PlainObject.json');

  jsonComplexObjFilePath1 = getFixturePath('file1ComplexObject.json');
  jsonComplexObjFilePath2 = getFixturePath('file2ComplexObject.json');

  // YAML
  yamlPlainObjFilePath1 = getFixturePath('file1PlainObject.yml');
  yamlPlainObjFilePath2 = getFixturePath('file2PlainObject.yml');

  // INI
  iniPlainObjFilePath1 = getFixturePath('file1PlainObject.ini');
  iniPlainObjFilePath2 = getFixturePath('file2PlainObject.ini');

  comparisonResult = readFixture('comparisonPlainObjStylishResult.txt');
  comparisonComplexResult = readFixture('comparisonComplexObjStylishResult.txt');
});

test('compareFiles(file1, file2, format = Stylish): JSON|YAML|INI format, get comparison for plain object', () => {
  expect(compareFiles(jsonPlainObjFilePath1, jsonPlainObjFilePath2)).toEqual(comparisonResult);
  expect(compareFiles(yamlPlainObjFilePath1, yamlPlainObjFilePath2)).toEqual(comparisonResult);
  expect(compareFiles(iniPlainObjFilePath1, iniPlainObjFilePath2)).toEqual(comparisonResult);
});

test('compareFiles(file1, file2, format = Stylish): JSON format, get comparison for complex object', () => {
  expect(compareFiles(
    jsonComplexObjFilePath1,
    jsonComplexObjFilePath2,
  )).toEqual(comparisonComplexResult);
});
