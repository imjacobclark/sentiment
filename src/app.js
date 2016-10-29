let TwitterAdapter = require('./adapters/TwitterAdapter');
let TwitterSentimentDecorator = require('./decorators/TweetSentimentDecorater');

let totalScore = 0;
let positiveWords = [];
let negativeWords = [];

let twitterAdapter = new TwitterAdapter().getTweets("#brexit").then(tweets => {
    tweets.map(tweet => {
        return new TwitterSentimentDecorator().decorate(tweet);
    }).forEach(tweet => {
        totalScore += tweet.sentiment.score;
        positiveWords = positiveWords.concat(tweet.sentiment.positive);
        negativeWords = negativeWords.concat(tweet.sentiment.negative);
    });
    console.log("A sample size of 100 tweets yielded a " + totalScore/100 + " average sentiment score with " + positiveWords.length + " of words being positive and " + negativeWords.length + " being negative.");
});