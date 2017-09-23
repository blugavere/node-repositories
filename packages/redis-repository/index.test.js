'use strict';

const expect = require('expect');
const redis = require('redis');
const Repo = require('.');
const Assertions = require('../../test/assertions');

// NODE_ENV=test mocha packages/redis-repository/index.test.js

describe('Redis Repository', () => {
  let repo;
  before(() => {
    const client = redis.createClient();
    repo = new Repo(client, 'client');
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
        if (err) {
          console.log(err);
        }
        expect(res._id).toEqual('x');
        setTimeout(() => {
          repo.findOne('x', (err, res) => {
            if (err) {
              console.log(err);
            }
            expect(res).toNotExist();
            done();
          });
        }, 1200);
      });
    });
  });

  describe('Promise Impementation', () => {
    let id;
    let obj;

    it('findAll', () => repo.findAll().then(res => {
      expect(res).toEqual([]);
    }));

    it('add', () => repo.add({}).then(res => {
      expect(typeof res).toEqual('object');
      id = res._id;
      obj = {_id: id, name: 'foo'};
    }));

    it('update', () => repo.update(obj).then(res => {
      expect(typeof res).toEqual('object');
      expect(res).toEqual(obj);
    }));

    it('findOne', () => repo.findOne(id).then(res => {
      expect(typeof res).toEqual('object');
      expect(res).toEqual(obj);
    }));

    it('remove', () => repo.remove(id).then(res => {
      expect(typeof res).toEqual('object');
      expect(res).toEqual(obj);
    }));
  });
});