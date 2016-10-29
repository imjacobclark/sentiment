'use strict';

let sentiment = require('sentiment');

class TweetSentimentDecorator {
    decorate(tweet) {
        tweet.sentiment = sentiment(tweet.tweet);
        return tweet;
    }
}

module.exports = TweetSentimentDecorator;