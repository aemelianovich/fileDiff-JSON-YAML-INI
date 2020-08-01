#!/usr/bin/env node

import commander from 'commander';
import compareFiles from '../src/index.js';

const gendiff = new commander.Command();

gendiff
  .version('0.1.0', '-V, --version', 'output the version number')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format');

gendiff
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    const res = compareFiles(filepath1, filepath2);
    console.log(res);
  });

gendiff.parse(process.argv);

if (gendiff.format) console.log(`- ${gendiff.format}`);
