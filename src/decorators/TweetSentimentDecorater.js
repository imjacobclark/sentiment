'use strict';

let sentiment = require('sentiment');

class TweetSentimentDecorater {
    decorate(tweet) {
        tweet.sentiment = sentiment(tweet.tweet);
        return tweet;
    }
}

module.exports = TweetSentimentDecorater;