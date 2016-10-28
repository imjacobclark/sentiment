let TwitterAdapter = require('./adapters/TwitterAdapter');

let twitterAdapter = new TwitterAdapter();
let actualResponse = twitterAdapter.getTweets().then(tweets => {
   console.log(tweets); 
});