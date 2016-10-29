'use strict';

const SOURCE_DIRECTORY = '../../../src/';

let chai = require('chai');
let chaiAsPromised = require("chai-as-promised");
let mocha = require('mocha');
let rewire = require("rewire");
let sinon = require('sinon');

let TweetSentimentDecorator = rewire(SOURCE_DIRECTORY + 'decorators/TweetSentimentDecorator');

chai.use(chaiAsPromised);

let expect = chai.expect;

describe('TweetSentimentDecorator', () => {
    describe('decorateTweet()', () => {
        it('should decorate a tweet with expected properties', () => {
            let tweetSentimentDecorator = new TweetSentimentDecorator();

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

            let actualResponse = tweetSentimentDecorator.decorate(tweet);

            return expect(actualResponse).to.deep.equal(expectedResponse);
        });
    });
});