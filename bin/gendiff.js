#!/usr/bin/env node

import commander from 'commander';

const gendiff = new commander.Command();

let filepath1Value;
let filepath2Value;

gendiff
  .version('0.1.0', '-V, --version', 'output the version number')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format');

gendiff
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    filepath1Value = filepath1;
    filepath2Value = filepath2;
  });

gendiff.parse(process.argv);

if (gendiff.format) console.log(`- ${gendiff.format}`);
console.log(`filepath1: ${filepath1Value}`);
console.log(`filepath2: ${filepath2Value}`);
