import { test, expect, beforeEach } from '@jest/globals';
import Comparison from '../src/comparison.js';
import Stylish from '../src/formatters/stylish.js';
import { readFixture } from '../src/utils.js';

// Init variables
let comparisonObj;
let obj1;
let obj2;

// Result variables
let comparisonStrResult;

beforeEach(() => {
  // Init data
  obj1 = JSON.parse(readFixture('stylish_files/obj1.json'));

  obj2 = JSON.parse(readFixture('stylish_files/obj2.json'));

  comparisonObj = Object.create(Comparison);
  comparisonObj.initComparison(obj1, obj2);

  comparisonStrResult = readFixture('stylish_files/stylish_str_result.txt');
});

test('Stylish.toString(): get string for complex objects', () => {
  expect(Stylish.toString(comparisonObj)).toBe(comparisonStrResult);
});
