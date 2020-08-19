import { test, expect, beforeEach } from '@jest/globals';
import getComparisonAST from '../src/comparison.js';
import { readFixture } from '../src/utils.js';
// Init variables
let obj1;
let obj2;

// Result variables
let addedKeysResult;
let removedKeysResult;
let notChangedKeysResult;
let changedKeysResult;
let nestedKeysResult;

let comparisonASTResult;

beforeEach(() => {
  // Init data
  obj1 = JSON.parse(readFixture('comparison_files/obj1.json'));
  obj2 = JSON.parse(readFixture('comparison_files/obj2.json'));

  // Result data
  addedKeysResult = JSON.parse(readFixture('comparison_files/added_keys_result.json')).addedKeys;
  removedKeysResult = JSON.parse(readFixture('comparison_files/removed_keys_result.json')).removedKeys;
  notChangedKeysResult = JSON.parse(readFixture('comparison_files/not_changed_keys_result.json')).notChangedKeys;
  changedKeysResult = JSON.parse(readFixture('comparison_files/changed_keys_result.json')).changedKeys;
  nestedKeysResult = JSON.parse(readFixture('comparison_files/nested_keys_result.json')).nestedKeys;

  comparisonASTResult = [
    ...addedKeysResult,
    ...removedKeysResult,
    ...notChangedKeysResult,
    ...changedKeysResult,
    ...nestedKeysResult,
  ];
});

test('Test AST tree: getComparisonAST(obj1, obj2)', () => {
  expect(getComparisonAST(obj1, obj2)).toEqual(comparisonASTResult);
});
