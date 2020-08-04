import { test, expect, beforeEach } from '@jest/globals';
import Comparison from '../src/comparison.js';
import { readFixture } from '../src/utils.js';
// Init variables
let comparisonObj;
let obj1;
let obj2;

// Result variables
let addedObjResult;
let removedObjResult;
let changedObjResult;
let notChangedObjResult;
let childComparisonObjResult;

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

  // Result data
  notChangedObjResult = {
    host: {
      firstKeyIndex: 0,
      secondKeyIndex: 2,
      value: 'hexlet.io',
    },
  };

  changedObjResult = {
    timeout: {
      firstKeyIndex: 1,
      firstValue: 50,
      secondKeyIndex: 0,
      secondValue: 20,
    },
  };

  addedObjResult = {
    group3: {
      firstKeyIndex: -1,
      secondKeyIndex: 5,
      value: {
        deep: {
          id: {
            number: 45,
          },
        },
        fee: 100500,
      },
    },
    verbose: {
      firstKeyIndex: -1,
      secondKeyIndex: 1,
      value: true,
    },
  };

  removedObjResult = {
    follow: {
      firstKeyIndex: 3,
      secondKeyIndex: -1,
      value: false,
    },
    group2: {
      firstKeyIndex: 6,
      secondKeyIndex: -1,
      value: {
        abc: 12345,
        deep: {
          id: 45,
        },
      },
    },
    proxy: {
      firstKeyIndex: 2,
      secondKeyIndex: -1,
      value: '123.234.53.22',
    },
  };

  childComparisonObjResult = {
    common: {
      added: {
        follow: {
          firstKeyIndex: -1,
          secondKeyIndex: 0,
          value: false,
        },
        setting4: {
          firstKeyIndex: -1,
          secondKeyIndex: 3,
          value: 'blah blah',
        },
        setting5: {
          firstKeyIndex: -1,
          secondKeyIndex: 4,
          value: {
            key5: 'value5',
          },
        },
      },
      changed: {
        setting3: {
          firstKeyIndex: 2,
          firstValue: true,
          secondKeyIndex: 2,
          secondValue: {
            key: 'value',
          },
        },
      },
      childComparison: {
        setting6: {
          added: {
            ops: {
              firstKeyIndex: -1,
              secondKeyIndex: 1,
              value: 'vops',
            },
          },
          changed: {},
          childComparison: {
            doge: {
              added: {},
              changed: {
                wow: {
                  firstKeyIndex: 0,
                  firstValue: 'too much',
                  secondKeyIndex: 0,
                  secondValue: 'so much',
                },
              },
              childComparison: {},
              depthLevel: 3,
              firstKeyIndex: 1,
              notChanged: {},
              removed: {},
              secondKeyIndex: 2,
            },
          },
          depthLevel: 2,
          firstKeyIndex: 3,
          notChanged: {
            key: {
              firstKeyIndex: 0,
              secondKeyIndex: 0,
              value: 'value',
            },
          },
          removed: {},
          secondKeyIndex: 5,
        },
      },
      depthLevel: 1,
      firstKeyIndex: 4,
      notChanged: {
        setting1: {
          firstKeyIndex: 0,
          secondKeyIndex: 1,
          value: 'Value 1',
        },
      },
      removed: {
        setting2: {
          firstKeyIndex: 1,
          secondKeyIndex: -1,
          value: 200,
        },
      },
      secondKeyIndex: 3,
    },
    group1: {
      added: {},
      changed: {
        baz: {
          firstKeyIndex: 0,
          firstValue: 'bas',
          secondKeyIndex: 1,
          secondValue: 'bars',
        },
        nest: {
          firstKeyIndex: 2,
          firstValue: {
            key: 'value',
          },
          secondKeyIndex: 2,
          secondValue: 'str',
        },
      },
      childComparison: {},
      depthLevel: 1,
      firstKeyIndex: 5,
      notChanged: {
        foo: {
          firstKeyIndex: 1,
          secondKeyIndex: 0,
          value: 'bar',
        },
      },
      removed: {},
      secondKeyIndex: 4,
    },
  };

  comparisonStrResult = readFixture('comparisonDefaultFormatterResult.txt');
});

test('Comparison.initComparison(obj1, obj2): get comparison for sub objects', () => {
  expect(comparisonObj.notChanged).toEqual(notChangedObjResult);
  expect(comparisonObj.changed).toEqual(changedObjResult);
  expect(comparisonObj.added).toEqual(addedObjResult);
  expect(comparisonObj.removed).toEqual(removedObjResult);
  expect(comparisonObj.childComparison).toEqual(childComparisonObjResult);
});

test('Comparison.toString(): get string for comparison objects', () => {
  expect(comparisonObj.toString()).toBe(comparisonStrResult);
});
