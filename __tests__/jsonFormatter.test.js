import { test, expect, beforeEach } from '@jest/globals';
import Comparison from '../src/comparison.js';
import JsonFormatter from '../src/formatters/jsonFormatter.js';
import { readFixture } from '../src/utils.js';

// Init variables
let comparisonObj;
let obj1;
let obj2;

// Result variables
let comparisonStrResult;

beforeEach(() => {
  // Init data
  obj1 = JSON.parse(readFixture('json_formatter_files/obj1.json'));

  obj2 = JSON.parse(readFixture('json_formatter_files/obj2.json'));

  comparisonObj = Object.create(Comparison);
  comparisonObj.initComparison(obj1, obj2);

  comparisonStrResult = readFixture('json_formatter_files/json_str_result.txt');
});

test('JsonFormatter.toString(): get string for complex objects', () => {
  expect(JsonFormatter.toString(comparisonObj)).toBe(comparisonStrResult);
});
