import { test, expect, beforeEach } from '@jest/globals';
import { readFixture } from '../src/utils.js';
import parseFile from '../src/parsers.js';

// Result variables
let objResult;
let jsonFileData;
let yamlFileData;
let iniFileData;

let yamlStrFileData;
let txtFileData;

beforeEach(() => {
  jsonFileData = readFixture('parser_files/json_object.json');
  yamlFileData = readFixture('parser_files/yaml_object.yml');
  iniFileData = readFixture('parser_files/ini_object.ini');

  yamlStrFileData = readFixture('parser_files/yaml_string.yml');
  txtFileData = readFixture('parser_files/test.txt');

  objResult = {
    host: 'hexlet.io',
    timeout: 50,
    proxy: '123.234.53.22',
    follow: false,
  };
});

test('parseFile: JSON file', () => {
  const fileFormat = '.json';
  expect(parseFile(jsonFileData, fileFormat)).toEqual(objResult);
});

test('parseFile: YAML file', () => {
  const fileFormat = '.yml';
  expect(parseFile(yamlFileData, fileFormat)).toEqual(objResult);
});

test('parseFile: INI file', () => {
  const fileFormat = '.ini';
  expect(parseFile(iniFileData, fileFormat)).toEqual(objResult);
});

test('parseFile: Unsupported format', () => {
  const fileFormat = '.txt';
  expect(() => parseFile(txtFileData, fileFormat)).toThrow('File format:".txt" is not supported');
});

test('parseFile: Unsupported parsed type', () => {
  const fileFormat = '.yml';
  expect(() => parseFile(yamlStrFileData, fileFormat)).toThrow('Result should be an object. Result type: "string"');
});
