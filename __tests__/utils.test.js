import { test, expect, beforeEach } from '@jest/globals';
import path from 'path';
import process from 'process';
import * as utils from '../src/utils.js';

let checkFile;

beforeEach(() => {
  checkFile = 'passed;';
});

test('readFixture: read test file', () => {
  const data = utils.readFixture('test.txt');
  expect(data).toEqual(checkFile);
});

test('readFile: absolute path', () => {
  const filePath = utils.getFixturePath('test.txt');
  expect(utils.readFile(filePath)).toEqual(checkFile);
});

test('readFile: relative path', () => {
  const currDir = process.cwd();
  const absoluteFilePath = utils.getFixturePath('test.txt');
  const relativeFilePath = path.relative(currDir, absoluteFilePath);
  expect(utils.readFile(relativeFilePath)).toEqual(checkFile);
});
