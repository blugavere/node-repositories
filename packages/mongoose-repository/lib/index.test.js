'use strict';

const assert = require('assert');
const expect = require('expect');
const Mockgoose = require('mock-mongoose-model');
const mongoose = require('mongoose');
const sinon = require('sinon');
const MongooseRepository = require('.');

/**
 * to run this test standalone:
 * NODE_ENV=test mocha packages/mongoose-repository/lib/index.test.js --watch
 */
const check = res => {
  expect(typeof res).toEqual('object');
  expect(typeof res._id).toBeA('string');
};

describe('Mongoose Repository', () => {
  let repo;
  let sandbox;
  const Model = Mockgoose;
  let _id;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    for (const i in Model) {
      if (i !== 'toString') {
        sandbox.stub(Model, i);
      }
    }
    repo = new MongooseRepository(mongoose, Model);
  });

  afterEach(() => sandbox.restore());

  describe('Object construction', () => {
    it('should fail if you create it with no param', () => {
      expect(() => new MongooseRepository()).toThrow();
    });
    it('should take a string arg', () => {
      sandbox.stub(mongoose, 'model').returns(Model);
      expect(() => new MongooseRepository(mongoose, 'Cat')).toNotThrow(); //getting mongoose model
    });
    it('should should take a func arg', () => {
      expect(() => new MongooseRepository(mongoose, () => {})).toNotThrow();
    });
  });

  describe('Generic Impementation', () => {
    describe('findAll', () => {
      it('should return an array', done => {
        Model.find.returns(Model);
        Model.lean.returns(Model);
        Model.exec.yields(null, []);
        repo.findAll((err, res) => {
          assert(!err);
          expect(Model.find.called).toBe(true);
          expect(Model.exec.called).toBe(true);
          expect(res).toEqual([]);
          done();
        });
      });

      it('should gracefully handle error', done => {
        Model.find.returns(Model);
        Model.lean.returns(Model);
        Model.exec.yields({});
        repo.findAll(err => {
          expect(Model.find.called).toBe(true);
          expect(Model.exec.called).toBe(true);
          expect(err).toEqual({});
          done();
        });
      });
    });



    describe('findOne', () => {
      it('should return an object', done => {
        Model.findOne.returns(Model);
        Model.lean.returns(Model);
        Model.exec.yields(null, {
          _id
        });

        repo.findOne('foo', (err, res) => {
          assert(!err);
          expect(Model.findOne.called).toBe(true, 'findOne');
          expect(Model.lean.called).toBe(true);
          expect(Model.exec.called).toBe(true);
          check(res);
          done();
        });
      });
      it('should gracefully handle error', done => {
        Model.findOne.returns(Model);
        Model.lean.returns(Model);
        Model.exec.yields({});
        repo.findOne('foo', err => {
          expect(Model.findOne.called).toBe(true);
          expect(Model.lean.called).toBe(true);
          expect(Model.exec.called).toBe(true);
          expect(err).toEqual({});
          done();
        });
      });
    });
    describe('add', () => {
      it('should add an object', done => {
        Model.create.yields(null, new Model());
        repo.add({}, (err, res) => {
          assert(!err);
          expect(Model.create.called).toBe(true, 'create method not called');
          check(res);
          done();
        });
      });
      it('should error gracefully', done => {
        Model.create.yields({});
        repo.add({}, err => {
          expect(Model.create.called).toBe(true, 'create method not called');
          expect(typeof err).toEqual('object');
          done();
        });
      });
    });
    describe('remove', () => {
      it('should remove an object', done => {
        Model.findByIdAndRemove.yields(null, new Model());
        repo.remove({
          _id: 'foo'
        }, (err, res) => {
          assert(!err);
          expect(Model.findByIdAndRemove.called).toBe(true, 'remove method not called');
          expect(typeof res).toEqual('object');
          check(res);
          done();
        });
      });
      it('should error gracefully', done => {
        Model.findByIdAndRemove.yields(null, new Model());
        repo.remove('foo', err => {
          expect(Model.findByIdAndRemove.called).toBe(true, 'create method not called');
          expect(typeof err).toEqual('object');
          done();
        });
      });
    });
    describe('update', () => {
      it('should update an object', done => {
        Model.findByIdAndUpdate.returns(Model);
        Model.exec.yields(null, new Model());
        repo.update({
          _id: 'foo'
        }, (err, res) => {
          if (err) {
            console.log(err);
          }
          expect(Model.findByIdAndUpdate.called).toBe(true, 'create method not called');
          check(res);
          done();
        });
      });
      it('should error gracefully', done => {
        Model.findByIdAndUpdate.returns(Model);
        Model.exec.yields({});
        repo.update({
          _id: 'foo'
        }, err => {
          if (err) {
            console.log(err);
          }
          expect(Model.findByIdAndUpdate.called).toBe(true, 'create method not called');
          expect(typeof err).toEqual('object');
          done();
        });
      });
    });
    describe('patch', () => {
      it('should patch an object', done => {
        Model.findOneAndUpdate.yields(null, new Model());
        repo.patch('abc', {}, (err, res) => {
          if (err) {
            console.log(err);
          }
          expect(Model.findOneAndUpdate.called).toBe(true);
          check(res);
          done();
        });
      });
      it('should error gracefully', done => {
        Model.findOneAndUpdate.yields({});
        repo.patch('abc', {}, err => {
          expect(Model.findOneAndUpdate.called).toBe(true);
          expect(typeof err).toEqual('object');
          done();
        });
      });
    });

    describe('clear', () => {
      it('should clear a collection', done => {
        Model.find.returns(Model);
        Model.remove.yields(null, {});
        repo.clear((err, res) => {
          if (err) {
            console.log(err);
          }
          expect(Model.remove.called).toBe(true, 'remove method not called');
          check(res);
          expect(res).toEqual({});
          done();
        });
      });
      it('should error gracefully', done => {
        Model.find.returns(Model);
        Model.remove.yields({});
        repo.clear(err => {
          expect(Model.remove.called).toBe(true, 'create method not called');
          expect(typeof err).toEqual('object');
          done();
        });
      });
    });

  });

  describe('Promise Impementation', () => {
    describe('findAll', () => {
      it('should return an array', () => {
        Model.find.returns(Model);
        Model.lean.returns(Model);
        Model.exec.yields(null, []);
        return repo.findAll().then(res => {
          expect(Model.find.called).toBe(true);
          expect(Model.exec.called).toBe(true);
          expect(res).toEqual([]);
        });
      });
    });

    describe('findOne', () => {
      it('should return an object', () => {
        Model.findOne.returns(Model);
        Model.lean.returns(Model);
        Model.exec.yields(null, new Model());
        return repo.findOne('foo').then(res => {
          expect(Model.findOne.called).toBe(true);
          expect(Model.lean.called).toBe(true);
          expect(Model.exec.called).toBe(true);
          check(res);
        });
      });
    });

    describe('add', () => {
      it('should add an object', () => {
        Model.create.yields(null, new Model());
        return repo.add({}).then(res => {
          expect(Model.create.called).toBe(true, 'create method not called');
          expect(typeof res).toEqual('object');
          // expect(res instanceof Mockgoose).toEqual(false);
          expect(res).toEqual({});
        });
      });
    });

    describe('remove', () => {
      it('should remove an object', () => {
        Model.findByIdAndRemove.yields(null, new Model());
        return repo.remove({
          _id: 'foo'
        }, (err, res) => {
          assert(!err);
          expect(Model.findByIdAndRemove.called).toBe(true, 'remove method not called');
          check(res);
        });
      });
    });
    describe('update', () => {
      it('should update an object', () => {
        Model.findByIdAndUpdate.returns(Model);
        Model.exec.yields(null, new Model());
        return repo.update({
          _id: 'foo'
        }).then(res => {
          expect(Model.findByIdAndUpdate.called).toBe(true, 'create method not called');
          check(res);
        });
      });
    });

    describe('patch', () => {
      it('should patch an object', () => {
        Model.findOneAndUpdate.yields(null, new Model());
        return repo.patch('abc', {}).then(res => {
          expect(Model.findOneAndUpdate.called).toBe(true);
          check(res);
        });
      });
    });

    describe('clear', () => {
      it('should clear a collection', () => {
        Model.find.returns(Model);
        Model.remove.yields(null, {});
        return repo.clear().then(res => {
          expect(Model.remove.called).toBe(true, 'remove method not called');
          check(res);
        });
      });
    });

  });
});