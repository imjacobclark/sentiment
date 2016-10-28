'use strict';

const CONNECTION_DETAILS = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

let Twitter = require('twitter');

function formatTweets(tweets) {
    return tweets.statuses.map((curr, index, arr) => {
        return {
            'tweet': curr.text
        };
    });
}

class TwitterAdapter {
    constructor() {
        this.client = new Twitter(CONNECTION_DETAILS);
    }

    getTweets(query) {
        return new Promise((resolve) => {
            return this.client.get('search/tweets', {q: query, count: 100}, (error, tweets, response) => {
                return resolve(formatTweets(tweets));
            });
        });
    }
}

module.exports = TwitterAdapter;