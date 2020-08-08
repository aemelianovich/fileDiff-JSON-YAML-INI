import { test, expect, beforeEach } from '@jest/globals';
import { getFixturePath } from '../src/utils.js';
import parseFile from '../src/parsers.js';

// Result variables
let objResult;
let jsonFilePath;
let yamlFilePath;
let iniFilePath;

let yamlStrFilePath;
let txtFilePath;

beforeEach(() => {
  jsonFilePath = getFixturePath('parser_files/json_object.json');
  yamlFilePath = getFixturePath('parser_files/yaml_object.yml');
  iniFilePath = getFixturePath('parser_files/ini_object.ini');

  yamlStrFilePath = getFixturePath('parser_files/yaml_string.yml');
  txtFilePath = getFixturePath('parser_files/test.txt');

  objResult = {
    host: 'hexlet.io',
    timeout: 50,
    proxy: '123.234.53.22',
    follow: false,
  };
});

test('parseFile: JSON file', () => {
  expect(parseFile(jsonFilePath)).toEqual(objResult);
});

test('parseFile: YAML file', () => {
  expect(parseFile(yamlFilePath)).toEqual(objResult);
});

test('parseFile: INI file', () => {
  expect(parseFile(iniFilePath)).toEqual(objResult);
});

test('parseFile: Unsupported format', () => {
  expect(() => parseFile(txtFilePath)).toThrow('File format:".txt" is not supported');
});

test('parseFile: Unsupported parsed type', () => {
  expect(() => parseFile(yamlStrFilePath)).toThrow('Result should be an object. Result type: "string"');
});
