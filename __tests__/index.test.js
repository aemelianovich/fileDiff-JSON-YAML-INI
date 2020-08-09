import { test, expect, beforeEach } from '@jest/globals';
import genDiff from '../src/index.js';
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

let stylishPlainResult;
let stylishComplexResult;
let jsonFormattedComplexResult;

let plainComplexResult;

beforeEach(() => {
  // JSON
  jsonPlainObjFilePath1 = getFixturePath('index_files/json_plain_file1.json');
  jsonPlainObjFilePath2 = getFixturePath('index_files/json_plain_file2.json');

  jsonComplexObjFilePath1 = getFixturePath('index_files/json_complex_file1.json');
  jsonComplexObjFilePath2 = getFixturePath('index_files/json_complex_file2.json');

  // YAML
  yamlPlainObjFilePath1 = getFixturePath('index_files/yaml_plain_file1.yml');
  yamlPlainObjFilePath2 = getFixturePath('index_files/yaml_plain_file2.yml');

  // INI
  iniPlainObjFilePath1 = getFixturePath('index_files/ini_plain_file1.ini');
  iniPlainObjFilePath2 = getFixturePath('index_files/ini_plain_file2.ini');

  // Results
  stylishPlainResult = readFixture('index_files/stylish_plain_result.txt');
  stylishComplexResult = readFixture('index_files/stylish_complex_result.txt');

  plainComplexResult = readFixture('index_files/plain_complex_result.txt');

  jsonFormattedComplexResult = readFixture('index_files/json_formatter_complex_result.txt');
});

test('compareFiles(file1, file2, format = "stylish"): JSON|YAML|INI format, get comparison for plain object', () => {
  const format = 'stylish';
  expect(genDiff(jsonPlainObjFilePath1, jsonPlainObjFilePath2, format)).toEqual(stylishPlainResult);
  expect(genDiff(yamlPlainObjFilePath1, yamlPlainObjFilePath2, format)).toEqual(stylishPlainResult);
  expect(genDiff(iniPlainObjFilePath1, iniPlainObjFilePath2, format)).toEqual(stylishPlainResult);
});

test('compareFiles(file1, file2, format = "stylish"): JSON input, get comparison for complex object', () => {
  const format = 'stylish';
  expect(genDiff(
    jsonComplexObjFilePath1,
    jsonComplexObjFilePath2,
    format,
  )).toEqual(stylishComplexResult);
});

test('compareFiles(file1, file2, format = "plain"): JSON input, get comparison for complex object', () => {
  const format = 'plain';
  expect(genDiff(
    jsonComplexObjFilePath1,
    jsonComplexObjFilePath2,
    format,
  )).toEqual(plainComplexResult);
});

test('compareFiles(file1, file2, format = "json"): JSON input, get comparison for complex object', () => {
  const format = 'json';
  expect(genDiff(
    jsonComplexObjFilePath1,
    jsonComplexObjFilePath2,
    format,
  )).toEqual(jsonFormattedComplexResult);
});
