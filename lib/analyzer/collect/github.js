var env = require('../config/local.env.js'),
    tokenDealer = require('token-dealer'),
    got = require('got'),
    tokens = env.githubTokens;

function fromGithub(packName, repository) {
  return new Promise(function (done, reject){

    tokenDealer(tokens, (token, exhaust) => {
        const handleRateLimit = (response, err) => {
            if (response.headers['x-ratelimit-remaining'] === '0') {
                const isRateLimitError = err && err.statusCode === 403 && /rate limit/i.test(response.body.message);
                exhaust(Number(response.headers['x-ratelimit-reset']) * 1000, isRateLimitError);
            }
        };

        return got('https://api.github.com/repos/'+repository, {
            json: true,
            headers: { Authorization: `token ${token}` },
        })
        .then((response) => {
            handleRateLimit(response);
            return response;
        }, (err) => {
            err.response && handleRateLimit(err.response, err);
            throw err;
        });
    })
    .then((response) => {

        if(response.statusCode == 404){
          // Throw error, continue to next..
          console.log("not found: "+packName);
        } else {
          var metadata = {};
          metadata.avatar_url = response.body.avatar_url;
          metadata.html_url = response.body.html_url;
          metadata.description = response.body.description;
          metadata.created_at = response.body.created_at;
          metadata.updated_at = response.body.updated_at;
          metadata.pushed_at = response.body.pushed_at;
          metadata.homepage = response.body.homepage;
          metadata.stargazers_count = response.body.stargazers_count;
          metadata.watchers_count = response.body.watchers_count;
          metadata.language = response.body.language;
          metadata.forks_count = response.body.forks_count;
          metadata.open_issues_count = response.body.open_issues_count;
          metadata.forks_count = response.body.forks_count;
          metadata.subscribers_count = response.body.subscribers_count;

        }

        done(metadata);

    }, (err) => {
        // If all tokens are exhausted, err.code will be 'EALLTOKENSEXHAUSTED'
        // Probably want to pause processing from the queue here if tokens ever exhaust
        console.log(err);
    });
  });

}

module.exports = {
  fromGithub: fromGithub
};
