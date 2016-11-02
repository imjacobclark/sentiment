/*global Promise:true */
'use strict';

const SOURCE_DIRECTORY = '../../../src/';

const CALLBACK_RESPONSE = { 'statuses': [{
    'text': 'Hello World'
}]}

Promise = require('bluebird');

let chai = require('chai');
let chaiAsPromised = require("chai-as-promised");
let mocha = require('mocha');
let rewire = require("rewire");
let sinon = require('sinon');

let TwitterAdaptor = rewire(SOURCE_DIRECTORY + 'adaptors/TwitterAdaptor');

chai.use(chaiAsPromised);

let expect = chai.expect;

describe('TwitterAdaptor', () => {
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

            TwitterAdaptor.__set__("Twitter", TwitterMock);
        });

        it('should return a JSON object of tweets', () => {
            let twitterAdaptor = new TwitterAdaptor();

            let expectedResponse = [
                [
                    {
                        'tweet': 'Hello World'
                    }
                ]
            ];

            let actualResponse = twitterAdaptor.getTweets('test', 1);
            return expect(Promise.all(actualResponse)).to.eventually.deep.equal(expectedResponse);
        });

        it('should map the twitter response property `text` to `tweet`', () => {
            let twitterAdaptor = new TwitterAdaptor();

            let expectedResponse = 'Hello World';

            return twitterAdaptor.getTweets('test', 1).all().then(tweets => {
                expect(tweets[0][0].tweet).to.equal(expectedResponse);
            });
        });

        it('should call the twitter API with an expected query', () => {
            let TwitterMock = function(){}
            TwitterMock.prototype.get = function(path, query, cb) {
                cb(null, CALLBACK_RESPONSE, {});
            }

            TwitterAdaptor.__set__("Twitter", TwitterMock);

            sinon.spy(TwitterMock.prototype, 'get');

            let twitterAdaptor = new TwitterAdaptor();

            twitterAdaptor.getTweets('#appleevent', 1);

            sinon.assert.called(TwitterMock.prototype.get.withArgs(sinon.match('search/tweets', { q: '#appleevent', count: 100 }, sinon.match.any)));
        });

        it('should call the twitter API an expected amount of times', () => {
            let TwitterMock = function(){}
            TwitterMock.prototype.get = function(path, query, cb) {
                cb(null, CALLBACK_RESPONSE, {});
            }

            TwitterAdaptor.__set__("Twitter", TwitterMock);

            sinon.spy(TwitterMock.prototype, 'get');

            let twitterAdaptor = new TwitterAdaptor();

            twitterAdaptor.getTweets('#appleevent', 2);

            sinon.assert.callCount(TwitterMock.prototype.get.withArgs(sinon.match('search/tweets', { q: '#appleevent', count: 100 }, sinon.match.any)), 2);
        });
    });
});
