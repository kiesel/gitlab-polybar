#!/usr/bin/env node
import * as util from 'util';
import { GitlabAPI } from './gitlab-api';
import yargs = require('yargs');

async function render(argv) {
  const result = await new GitlabAPI({ host: `${argv.url}/api/v4`, privateToken: argv.apikey }).fetch(argv);

  if (argv.debug) {
    console.log(result);
  }

  let output = '';
  output += util.format(
    '%d/%d  | %d/%d  | %d/%d ',
    result.mrForMe.length,
    result.mrForMe.filter(value => !value.work_in_progress).length,
    result.mrByMe.length,
    result.mrByMe.filter(value => !value.work_in_progress).length,
    result.mrAllMe.length,
    result.mrAllMe.filter(value => value.work_in_progress).length,
  );

  console.log(output.trimRight());
}

yargs.usage('$0 <command> [args]').command(
  'fetch [--mr-for-me] [--mr-by-me]',
  'Fetch GitLab status',
  (args: yargs.Argv) =>
    args
      .option('mr-for-me', { type: 'boolean', default: false })
      .option('mr-by-me', { type: 'boolean', default: false })
      .option('url', { type: 'string', default: 'https://gitlab.com' })
      .option('apikey', { type: 'string' })
      .option('debug', { type: 'boolean', default: false }),
  async argv => render(argv),
).argv;
