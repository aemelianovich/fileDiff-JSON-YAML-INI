import { test, expect, beforeEach } from '@jest/globals';
import Comparison from '../src/comparison.js';

// Init variables
let comparisonObj;
let plainObj1;
let plainObj2;

// Result variables
let addedObjResult;
let addedObjStrResult;

let removedObjResult;
let removedObjStrResult;

let changedObjResult;
let changedObjStrResult;

let notChangedObjResult;
let notChangedObjStrResult;

let comparisonStrResult;

beforeEach(() => {
  // Init data
  plainObj1 = {
    host: 'hexlet.io',
    timeout: 50,
    proxy: '123.234.53.22',
    follow: false,
  };

  plainObj2 = {
    timeout: 20,
    verbose: true,
    host: 'hexlet.io',
  };

  comparisonObj = Object.create(Comparison);
  comparisonObj.initComparison(plainObj1, plainObj2);

  // Result data
  addedObjResult = { verbose: true };
  addedObjStrResult = '    + verbose: true';

  removedObjResult = { proxy: '123.234.53.22', follow: false };
  removedObjStrResult = ['    - proxy: 123.234.53.22', '    - follow: false'].join('\n');

  changedObjResult = { timeout: [50, 20] };
  changedObjStrResult = ['    - timeout: 50', '    + timeout: 20'].join('\n');

  notChangedObjResult = { host: 'hexlet.io' };
  notChangedObjStrResult = '      host: hexlet.io';

  comparisonStrResult = ['{',
    '      host: hexlet.io',
    '    - timeout: 50',
    '    + timeout: 20',
    '    + verbose: true',
    '    - proxy: 123.234.53.22',
    '    - follow: false',
    '}'].join('\n');
});

test('Comparison.initComparison(obj1, obj2): get comparison for plain objects', () => {
  expect(comparisonObj.addedObj).toEqual(addedObjResult);
  expect(comparisonObj.removedObj).toEqual(removedObjResult);
  expect(comparisonObj.changedObj).toEqual(changedObjResult);
  expect(comparisonObj.notChangedObj).toEqual(notChangedObjResult);
});

test('Comparison.toStringKeyValue(indentNum, sign, key, value): get string for key, value', () => {
  expect(comparisonObj.toStringKeyValue(3, '+', 'key', 'value')).toBe('   + key: value');
});

test('Comparison.toStringObj(obj): get string for comparison plain sub objects', () => {
  expect(comparisonObj.toStringObj(comparisonObj.notChangedObj)).toBe(notChangedObjStrResult);
  expect(comparisonObj.toStringObj(comparisonObj.changedObj)).toBe(changedObjStrResult);
  expect(comparisonObj.toStringObj(comparisonObj.addedObj)).toBe(addedObjStrResult);
  expect(comparisonObj.toStringObj(comparisonObj.removedObj)).toBe(removedObjStrResult);
});

test('Comparison.toStringObj(obj): get error for undefined sub objects', () => {
  expect(() => comparisonObj.toStringObj({})).toThrow('Undefined object');
});

test('Comparison.toString(): get string for comparison plain objects', () => {
  expect(comparisonObj.toString()).toBe(comparisonStrResult);
});
