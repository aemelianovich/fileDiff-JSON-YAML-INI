#!/usr/bin/env node

import commander from 'commander';
import genDiff from '../src/index.js';

const gendiff = new commander.Command();

gendiff
  .version('0.1.0', '-V, --version', 'output the version number')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish');

gendiff
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    const res = genDiff(filepath1, filepath2, gendiff.format);
    console.log(res);
  });

gendiff.parse(process.argv);
