const core = require('@actions/core');
const axios = require('axios');
const slackifyMarkdown = require('slackify-markdown');

async function validateSubscription() {
    const API_URL = `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/subscription`;
  
    try {
      await axios.get(API_URL, {timeout: 3000});
    } catch (error) {
      if (error.response) {
        console.error(
          'Subscription is not valid. Reach out to support@stepsecurity.io'
        );
        process.exit(1);
      } else {
        core.info('Timeout or API not reachable. Continuing to next step.');
      }
    }
}


async function run() {
    try {
      await validateSubscription();
      const input = core.getInput('text', { required: true });
      const mrkdwn = slackifyMarkdown(input);
      const output = mrkdwn.replace(/\r\n|\r|\n/g, "\n");
      core.setOutput("text", output);
    } catch (error) {
      core.setFailed(error.message);
    }
}
  
run();
  