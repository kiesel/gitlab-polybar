import { GitlabAPI } from './gitlab-api';
import yargs = require('yargs');

async function render(argv) {
  const result = await new GitlabAPI({ host: `${argv.url}/api/v4`, privateToken: argv.apikey }).fetch(argv);

  if (result.mrForMe.length > 0) {
    console.log('%d ', result.mrForMe.length);
  }

  if (result.mrByMe.length > 0) {
    console.log('%d ', result.mrByMe.length);
  }

  if (result.mrAllMe.length > 0) {
    console.log('%d ', result.mrAllMe.length);
  }
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
