/*global Promise:true */
'use strict';

Promise = require('bluebird');

let TwitterAdaptor = require('./src/adaptors/TwitterAdaptor');
let TwitterSentimentDecorator = require('./src/decorators/TweetSentimentDecorator');

let totalScore = 0;
let positiveWords = [];
let negativeWords = [];

let twitterAdaptor = new TwitterAdaptor().getTweets('producthunt', 1).all().then(tweets => {
    tweets = [].concat.apply([], tweets);
    
    tweets.map(tweet => {
        return new TwitterSentimentDecorator().decorate(tweet);
    }).forEach(tweet => {
        totalScore += tweet.sentiment.score;
        positiveWords = positiveWords.concat(tweet.sentiment.positive);
        negativeWords = negativeWords.concat(tweet.sentiment.negative);
    });

    console.log({
        'totalScore': totalScore,
        'positiveWords': positiveWords,
        'negativeWords': negativeWords,
        'description': 'A sample size of ' + tweets.length + ' tweets yielded a ' + totalScore/tweets.length + ' average sentiment score with ' + positiveWords.length + ' of words being positive and ' + negativeWords.length + ' being negative.'
    });
});