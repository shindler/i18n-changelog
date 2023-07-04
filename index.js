const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).argv;

const rawLangs = argv.langs ?? '';
const targetLangs = rawLangs.includes(',') ? rawLangs.split(',') : [rawLangs];
const changelogPath = argv.changelog;
const dryRun = argv.dryRun ?? false;

const Applier = require('./src/applier');

new Applier(
  changelogPath,
  targetLangs,
  dryRun
);
