'use strict';

const expect = require('expect');
const redis = require('redis');
const Repo = require('.');
const Assertions = require('../../test/assertions');

describe('Redis Repository', () => {
  let repo = new Repo(redis, 'client');

  before(() => {
    repo.clear();
  });

  after(() => {
    repo.disconnect();
  });

  describe('generic assertions', () => {
    const client = {
      name: 'foo'
    };
    const bag = {
      client
    };
    Assertions.assertions.forEach(x => {
      it(x.assertion, done => {
        x.method(repo, bag)(done);
      });
    });
  });
  describe('redis features', () => {

    it('should be able to add with your own id', done => {
      repo.add({
        _id: 'x',
        name: 'y'
      }, (err, res) => {
        expect(res._id).toEqual('x');
        repo.findOne('x', (err, res) => {
          expect(res.name).toEqual('y');
          done();
        });
      });
    });

    it('should be able to add with an expiry', done => {
      repo.add({
        _id: 'x',
        name: 'y'
      }, {
        expire: 1
      }, (err, res) => {
        expect(res._id).toEqual('x');
        setTimeout(() => {
          repo.findOne('x', (err, res) => {
            expect(res).toNotExist();
            done();
          });
        }, 1000);
      });
    });
  });
});
