import { GitlabAPI } from './gitlab-api';
import yargs = require('yargs');

async function render(argv) {
  const result = await new GitlabAPI({ host: `${argv.url}/api/v4`, privateToken: argv.apikey }).fetch(argv);

  console.log(result);
  console.log('%d assigned to you', result.mrForMe.length);
  console.log('%d opened by you', result.mrByMe.length);
  console.log('%d assigned by yourself', result.mrAllMe.length);
}

yargs.usage('$0 <command> [args]').command(
  'fetch [--mr-for-me] [--mr-by-me]',
  'Fetch GitLab status',
  (args: yargs.Argv) =>
    args
      .option('mr-for-me', { type: 'boolean', default: false })
      .option('mr-by-me', { type: 'boolean', default: false })
      .option('url', { type: 'string', default: 'https://gitlab.com' })
      .option('apikey', { type: 'string' }),
  async argv => render(argv),
).argv;
