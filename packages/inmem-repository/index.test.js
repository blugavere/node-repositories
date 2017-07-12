'use strict';

const assert = require('assert');
const expect = require('expect');
const Repo = require('.');
const assertions = require('../../test/assertions');

// mocha packages/inmem-repository/index.test.js --watch

describe('In-Memory Repository', () => {
  const repo = new Repo();
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
    assertions.assertions.forEach(x => {
      it(x.assertion, done => {
        x.method(repo, bag)(done);
      });
    });
  });

  describe('expiry features', () => {

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
        if(err) {
          console.log(err);
        }
        expect(res._id).toEqual('x');
        setTimeout(() => {
          repo.findOne('x', (err, res) => {
            if(err) {
              console.log(err);
            }
            expect(res).toNotExist();
            done();
          });
        }, 1200);
      });
    });
  });

  describe('other', () => {
    ['update', 'remove'].forEach(testCase => {
    it(`should return null for ${testCase} that dont exist`, done => {
      repo[testCase]({
        _id: 'foo'
      }, (err, res) => {
        assert(!err);
        expect(res).toEqual(null);
        done();
      });
    });
    });
  });
});
