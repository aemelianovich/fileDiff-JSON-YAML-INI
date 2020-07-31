import { test, expect, beforeEach } from '@jest/globals';
import compareJsonFiles from '../src/index.js';
import { getFixturePath } from '../src/utils.js';

let filePath1;
let filePath2;
let jsonComparisonResult;

beforeEach(() => {
  filePath1 = getFixturePath('file1.json');
  filePath2 = getFixturePath('file2.json');

  jsonComparisonResult = ['{',
    '      host: hexlet.io',
    '    - timeout: 50',
    '    + timeout: 20',
    '    + verbose: true',
    '    - proxy: 123.234.53.22',
    '    - follow: false',
    '}'].join('\n');
});

test('compareJsonFiles(file1, file2): get comparison for plain objects', () => {
  expect(compareJsonFiles(filePath1, filePath2)).toEqual(jsonComparisonResult);
});
