#!/usr/bin/env node

import commander from 'commander';
import genDiff from '../src/index.js';

const cliProgram = commander.program;

cliProgram
  .version('0.1.0', '-V, --version', 'output the version number')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    const res = genDiff(filepath1, filepath2, cliProgram.format);
    console.log(res);
  });

cliProgram.parse(process.argv);
