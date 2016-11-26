/*global Promise:true */
'use strict';

const SOURCE_DIRECTORY = '../../../src/';

const CALLBACK_RESPONSE = [{
    'text': 'Hello World',
    'created_at': new Date().toString()
},{
    'text': 'Hello World',
    'created_at': 'Fri Nov 25 2016 12:00:00 GMT+0000 (GMT)'
}];

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

        it('should return a JSON array of objects with a single tweet property wrapped as a promise', () => {
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

            twitterAdaptor.getTweets('imjacobclark', 1);

            sinon.assert.called(TwitterMock.prototype.get.withArgs(sinon.match('statuses/user_timeline', {screen_name: 'imjacobclark', count: 100, include_rts: false}, sinon.match.any)));
        });

        it('should call the twitter API an expected amount of times', () => {
            let TwitterMock = function(){}
            TwitterMock.prototype.get = function(path, query, cb) {
                cb(null, CALLBACK_RESPONSE, {});
            }

            TwitterAdaptor.__set__("Twitter", TwitterMock);

            sinon.spy(TwitterMock.prototype, 'get');

            let twitterAdaptor = new TwitterAdaptor();

            twitterAdaptor.getTweets('imjacobclark', 2);

            sinon.assert.callCount(TwitterMock.prototype.get.withArgs(sinon.match('statuses/user_timeline', {screen_name: 'imjacobclark', count: 100, include_rts: false}, sinon.match.any)), 2);
        });

        it('should handle throw an error if unable to get tweets from Twitter', () => {
            let TwitterMock = function(){}
            TwitterMock.prototype.get = function(path, query, cb) {
                cb([{'message': 'error'}], CALLBACK_RESPONSE, {});
            }

            TwitterAdaptor.__set__("Twitter", TwitterMock);

            sinon.spy(TwitterMock.prototype, 'get');

            let twitterAdaptor = new TwitterAdaptor();

            let expectedResponse = [
                []
            ];

            expect(twitterAdaptor.getTweets('#appleevent', 1).all()).to.eventually.deep.equal(expectedResponse);
        });
    });
});
