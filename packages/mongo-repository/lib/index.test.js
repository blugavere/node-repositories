'use strict';

const assert = require('assert');
const sinon = require('sinon');
const Repo = require('.');

const mock = {
  collection() {},
  close() {},
  s: {
    pkFactory() {}
  },
  findAndModify() {},
  findAndRemove(){},
  findOne(){}
};

describe('units', () => {
  let sandbox;
  let repo;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(mock);
    sandbox.stub(mock.s);
    mock.s.pkFactory.returns('foo');
    mock.collection.returns(mock);
    repo = new Repo(mock, 'Cats');
  });
  afterEach(() => sandbox.restore());

  describe('update', () => {
    it('should update', done => {
      mock.s.pkFactory.returns('foo');
      mock.findAndModify.yields(null, {
        value: {}
      });
      repo.update({
        _id: 'foo'
      }, err => {
        assert(!err);
        assert.ok(mock.s.pkFactory.called);
        assert.ok(mock.findAndModify.called);
        done();
      });
    });
    it('should handle update err - 1 of 1', done => {
      mock.s.pkFactory.returns('foo');
      mock.findAndModify.yields({});
      repo.update({
        _id: 'foo'
      }, err => {
        assert.ok(err);
        assert.ok(mock.s.pkFactory.called);
        assert.ok(mock.findAndModify.called);
        done();
      });
    });
  });
  describe('remove', () => {
    it('should remove', done => {
      mock.findOne.yields(null, {});
      mock.findAndRemove.yields(null, {});
      repo.remove('foo', err => {
        assert(!err);
        assert.ok(mock.s.pkFactory.called);
        assert.ok(mock.findAndRemove.called);
        done();
      });
    });
    it('should handle update err - 1 of 2', done => {
      mock.findOne.yields(null, {
        value: {}
      });
      mock.findAndRemove.yields({});
      repo.remove('foo', err => {
        assert.ok(err);
        assert.ok(mock.s.pkFactory.called);
        assert.ok(mock.findAndRemove.called);
        done();
      });
    });
    it('should handle update err - 2 of 2', done => {
      mock.findOne.yields({});
      repo.remove('foo', err => {
        assert.ok(err);
        assert.strictEqual(mock.s.pkFactory.called, true);
        assert.strictEqual(mock.findAndRemove.called, false);
        done();
      });
    });
  });
});
