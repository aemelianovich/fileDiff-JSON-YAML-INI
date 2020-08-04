import { test, expect, beforeEach } from '@jest/globals';
import Comparison from '../src/comparison.js';
import Stylish from '../src/formatter/stylish.js';
import { readFixture } from '../src/utils.js';

// Init variables
let comparisonObj;
let obj1;
let obj2;

// Result variables
let comparisonStrResult;

beforeEach(() => {
  // Init data
  obj1 = {
    host: 'hexlet.io',
    timeout: 50,
    proxy: '123.234.53.22',
    follow: false,
    common: {
      setting1: 'Value 1',
      setting2: 200,
      setting3: true,
      setting6: {
        key: 'value',
        doge: {
          wow: 'too much',
        },
      },
    },
    group1: {
      baz: 'bas',
      foo: 'bar',
      nest: {
        key: 'value',
      },
    },
    group2: {
      abc: 12345,
      deep: {
        id: 45,
      },
    },
  };

  obj2 = {
    timeout: 20,
    verbose: true,
    host: 'hexlet.io',
    common: {
      follow: false,
      setting1: 'Value 1',
      setting3: {
        key: 'value',
      },
      setting4: 'blah blah',
      setting5: {
        key5: 'value5',
      },
      setting6: {
        key: 'value',
        ops: 'vops',
        doge: {
          wow: 'so much',
        },
      },
    },
    group1: {
      foo: 'bar',
      baz: 'bars',
      nest: 'str',
    },
    test: 2,
    group3: {
      fee: 100500,
      deep: {
        id: {
          number: 45,
        },
      },
    },
  };

  comparisonObj = Object.create(Comparison);
  comparisonObj.initComparison(obj1, obj2);

  comparisonStrResult = readFixture('stylishComplexResult.txt');
});

test('Comparison.toString(Stylish): get string for complex objects', () => {
  expect(comparisonObj.toString(Stylish)).toBe(comparisonStrResult);
});
