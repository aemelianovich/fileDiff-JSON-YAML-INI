#!/usr/bin/env node

import commander from 'commander';

const gendiff = new commander.Command();

gendiff
  .version('001', '-V, --version', 'output the version number')
  .description('Compares two configuration files and shows a difference.');

gendiff.parse(process.argv);

if (!gendiff.args.length) gendiff.help();
