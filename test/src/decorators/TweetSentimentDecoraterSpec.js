'use strict';

const SOURCE_DIRECTORY = '../../../src/';

let chai = require('chai');
let chaiAsPromised = require("chai-as-promised");
let mocha = require('mocha');
let rewire = require("rewire");
let sinon = require('sinon');

let TweetSentimentDecorater = rewire(SOURCE_DIRECTORY + 'decorators/TweetSentimentDecorater');

chai.use(chaiAsPromised);

let expect = chai.expect;

describe('TweetSentimentDecorater', () => {
    describe('decorateTweet()', () => {
        it('should decorate a tweet with expected properties', () => {
            let tweetSentimentDecorater = new TweetSentimentDecorater();

            let tweet = {
                'tweet': 'This is amazingly fantastic.'
            };

            let expectedResponse = {
                'tweet': 'This is amazingly fantastic.',
                'sentiment': { 
                    score: 4,
                    comparative: 1,
                    tokens: [ 'this', 'is', 'amazingly', 'fantastic' ],
                    words: [ 'fantastic' ],
                    positive: [ 'fantastic' ],
                    negative: [] 
                }
            };

            let actualResponse = tweetSentimentDecorater.decorate(tweet);

            return expect(actualResponse).to.deep.equal(expectedResponse);
        });
    });
});