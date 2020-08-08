import { test, expect, beforeEach } from '@jest/globals';
import Comparison from '../src/comparison.js';
import Plain from '../src/formatters/plain.js';
import { readFixture } from '../src/utils.js';

// Init variables
let comparisonObj;
let obj1;
let obj2;

// Result variables
let comparisonStrResult;

beforeEach(() => {
  // Init data
  obj1 = JSON.parse(readFixture('plain_files/obj1.json'));

  obj2 = JSON.parse(readFixture('plain_files/obj2.json'));

  comparisonObj = Object.create(Comparison);
  comparisonObj.initComparison(obj1, obj2);

  comparisonStrResult = readFixture('plain_files/plain_str_result.txt');
});

test('Comparison.toString(Stylish): get string for complex objects', () => {
  expect(Plain.toString(comparisonObj)).toBe('');
});
