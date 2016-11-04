/*global Promise:true */
'use strict';

const CONNECTION_DETAILS = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

Promise = require('bluebird');

let Twitter = require('twitter');

function formatTweets(tweets) {
    return tweets.statuses.map((curr, index, arr) => {
        return {
            'tweet': curr.text
        };
    });
}

function getTweet(query) {
    return new Promise((resolve, reject) => {
        let client = new Twitter(CONNECTION_DETAILS);
        return client.get('search/tweets', {q: query, count: 100}, (error, tweets, response) => {
            if(error){
                return reject(new Error('Twitter API Error ' + error[0].message));
            }

            return resolve(formatTweets(tweets));
        });
    }).catch(e => { 
        return [];
    });
}

class TwitterAdaptor {
    getTweets(query, count) {
        return new Promise((resolve) => {
            let tweetPromises = [];
            for(let i = 0; i < count; i++){
                tweetPromises.push(getTweet(query));
            }
            return resolve(tweetPromises);
        });
    }
}

module.exports = TwitterAdaptor;
