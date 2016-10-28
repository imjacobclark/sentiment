'use strict';

const SOURCE_DIRECTORY = '../../../src/';

const CALLBACK_RESPONSE = { 'statuses': [{
    'text': 'Hello World'
}]}

let chai = require('chai');
let chaiAsPromised = require("chai-as-promised");
let mocha = require('mocha');
let rewire = require("rewire");
let sinon = require('sinon');

let TwitterAdapter = rewire(SOURCE_DIRECTORY + 'adapters/TwitterAdapter');

chai.use(chaiAsPromised);

let expect = chai.expect;

describe('TwitterAdapter', () => {
    describe('getTweets()', () => {
        beforeEach(() => {
            function TwitterMock() {
                function get(path, query, cb) {
                    cb(null, CALLBACK_RESPONSE, {});
                }

                return {
                    get: get
                }
            }

            TwitterAdapter.__set__("Twitter", TwitterMock);
        });

        it('should return a JSON object of tweets', () => {
            let twitterAdapter = new TwitterAdapter();

            let expectedResponse = [{
                'tweet': 'Hello World'
            }];

            let actualResponse = twitterAdapter.getTweets();

            return expect(actualResponse).to.eventually.deep.equal(expectedResponse);
        });

        it('should map the twitter response property `text` to `tweet`', () => {
            let twitterAdapter = new TwitterAdapter();

            let expectedResponse = 'Hello World';

            return twitterAdapter.getTweets().then(tweets => {
                expect(tweets[0].tweet).to.equal(expectedResponse);
            });
        });

        it('should call the twitter API with an expected query', () => {
            let TwitterMock = function(){}
            TwitterMock.prototype.get = function(path, query, cb) {
                cb(null, CALLBACK_RESPONSE, {});
            }

            TwitterAdapter.__set__("Twitter", TwitterMock);

            sinon.spy(TwitterMock.prototype, 'get');

            let twitterAdapter = new TwitterAdapter();

            twitterAdapter.getTweets('#appleevent');

            sinon.assert.calledOnce(TwitterMock.prototype.get.withArgs(sinon.match('search/tweets', { q: '#appleevent', count: 100 }, sinon.match.any)));
        });
    });
});