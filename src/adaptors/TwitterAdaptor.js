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
    return tweets
        .filter(tweet => {
            let tweetDate = new Date(Date.parse(tweet.created_at));
            return tweetDate.getDate() === new Date().getDate() && tweetDate.getMonth() === new Date().getMonth();
        }).map(tweet => {
            return {
                'tweet': tweet.text
            };
        });
}

function getTweet(screenName) {
    return new Promise((resolve, reject) => {
        let client = new Twitter(CONNECTION_DETAILS);
        return client.get('statuses/user_timeline', {screen_name: screenName, count: 100, include_rts: false}, (error, tweets, response) => {
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
