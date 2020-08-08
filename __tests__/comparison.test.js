import { test, expect, beforeEach } from '@jest/globals';
import Comparison from '../src/comparison.js';
import { readFixture } from '../src/utils.js';
// Init variables
let comparisonObj;
let obj1;
let obj2;

// Result variables
let rootKeyResult;
let addedKeysResult;
let removedKeysResult;
let notChangedPlainKeysResult;
let changedKeysResult;
let commonObjectKeysResult;

let comparisonObjectResult;

beforeEach(() => {
  // Init data
  obj1 = JSON.parse(readFixture('comparison_files/obj1.json'));
  obj2 = JSON.parse(readFixture('comparison_files/obj2.json'));

  comparisonObj = Object.create(Comparison);
  comparisonObj.initComparison(obj1, obj2);

  // Result data
  rootKeyResult = null;
  addedKeysResult = JSON.parse(readFixture('comparison_files/added_keys_result.json')).addedKeys;
  removedKeysResult = JSON.parse(readFixture('comparison_files/removed_keys_result.json')).removedKeys;
  notChangedPlainKeysResult = JSON.parse(readFixture('comparison_files/not_changed_plain_keys_result.json')).notChangedPlainKeys;
  changedKeysResult = JSON.parse(readFixture('comparison_files/changed_keys_result.json')).changedKeys;
  commonObjectKeysResult = JSON.parse(readFixture('comparison_files/common_object_keys_result.json')).commonObjectKeys;

  comparisonObjectResult = {
    rootKey: rootKeyResult,
    addedKeys: addedKeysResult,
    removedKeys: removedKeysResult,
    notChangedPlainKeys: notChangedPlainKeysResult,
    changedKeys: changedKeysResult,
    commonObjectKeys: commonObjectKeysResult,
  };
});

test('Comparison.initComparison(obj1, obj2): Check comparison key properties', () => {
  expect(comparisonObj.rootKey).toEqual(rootKeyResult);
  expect(comparisonObj.addedKeys).toEqual(addedKeysResult);
  expect(comparisonObj.removedKeys).toEqual(removedKeysResult);
  expect(comparisonObj.notChangedPlainKeys).toEqual(notChangedPlainKeysResult);
  expect(comparisonObj.changedKeys).toEqual(changedKeysResult);
  expect(comparisonObj.commonObjectKeys).toEqual(commonObjectKeysResult);
});

test('Comparison.initComparison(obj1, obj2): check whole comparison objects', () => {
  expect(comparisonObj).toEqual(comparisonObjectResult);
});
