'use strict';

import assert from 'assert';
import expect from 'expect';

export const add = (repo, bag) => done => {
  repo.add(bag.client, (err, res) => {
    assert(!err);
    expect(res).toExist();
    expect(res._id).toExist();
    bag.id = res._id;
    // console.log(repo.constructor.name, bag.id);
    expect(res.name).toBe(bag.client.name);
    done();
  });
};

export const findAll = repo => done => {
  repo.findAll((err, res) => {
    assert(!err);
    expect(res).toExist();
    expect(Array.isArray(res)).toBe(true);
    expect(typeof res[0]._id).toNotBe('object');
    done();
  });
};

export const findOne = (repo, bag) => done => {
  repo.findOne(bag.id, (err, res) => {
    if (err) {
      console.log(err);
    }
    expect(res).toExist('findOne is not returning an object');
    expect(typeof res._id).toNotBe('object');
    expect(res.name).toBe(bag.client.name);
    done();
  });
};

export const update = (repo, bag) => done => {
  repo.update({
    _id: bag.id,
    name: 'baz'
  }, (err, res) => {
    if (err) {
      console.log(err);
    }
    expect(res).toExist();
    expect(typeof res._id).toNotBe('object');
    expect(res.name).toBe('baz');
    done();
  });
};

export const remove = (repo, bag) => done => {
  repo.remove(bag.id, (err, res) => {
    assert(!err);
    expect(res).toExist();
    expect(res.name).toBe('baz');
    expect(typeof res._id).toNotBe('object');
    repo.findOne(bag.id, (err, res) => {
      assert(!err);
      expect(res).toNotExist();
      done();
    });
  });
};

export const disconnect = repo => done => {
  expect(typeof repo.disconnect).toExist();
  expect(typeof repo.disconnect).toBe('function');
  done();
};

export const clear = repo => done => {
  expect(typeof repo.clear).toExist();
  expect(typeof repo.clear).toBe('function');
  done();
};

export const assertions = [{
  assertion: 'should add',
  method: add,
}, {
  assertion: 'should findAll',
  method: findAll,
}, {
  assertion: 'should findOne',
  method: findOne,
}, {
  assertion: 'should update',
  method: update,
}, {
  assertion: 'should remove',
  method: remove,
}, {
  assertion: 'should expose an endpoint to disconnect',
  method: disconnect,
}, {
  assertion: 'should be able to truncate',
  method: clear,
}];
