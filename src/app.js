/*global Promise:true */
'use strict';

Promise = require('bluebird');

let TwitterAdaptor = require('./adaptors/TwitterAdaptor');
let TwitterSentimentDecorator = require('./decorators/TweetSentimentDecorator');

let totalScore = 0;
let positiveWords = [];
let negativeWords = [];

let twitterAdaptor = new TwitterAdaptor().getTweets("@producthunt", 10).all().then(tweets => {
    tweets = [].concat.apply([], tweets);
    
    tweets.map(tweet => {
        return new TwitterSentimentDecorator().decorate(tweet);
    }).forEach(tweet => {
        totalScore += tweet.sentiment.score;
        positiveWords = positiveWords.concat(tweet.sentiment.positive);
        negativeWords = negativeWords.concat(tweet.sentiment.negative);
    });
    console.log("A sample size of " + tweets.length + " tweets yielded a " + totalScore/tweets.length + " average sentiment score with " + positiveWords.length + " of words being positive and " + negativeWords.length + " being negative.");
});