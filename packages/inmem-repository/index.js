
'use strict';

const uuid = require('uuid');
const autoBind = require('auto-bind');

/**
 * @class InMemoryDB
 */
class InMemoryDB {
  constructor() {
    this.data = {};
    autoBind(this);
  }

  findAll(cb) {
    const self = this;
    const results = Object.keys(self.data).map(key => self.data[key]);
    return cb(null, results);
  }

  findOne(id, cb) {
    const self = this;
    const result = self.data[id] || null;
    return cb(null, result);
  }

  add(obj, options, cb) {
    const self = this;
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    const id = obj._id ? obj._id : uuid.v4();
    self.data[id] = Object.assign(obj, { _id: id });

    if (options.expire) {
      setTimeout(() => {
        delete self.data[obj._id];
      }, options.expire);
    }

    return cb(null, obj);
  }

  clear(cb) {
    this.data = {};
    cb && cb();
  }

  update(entity, cb) {
    const self = this;
    if (self.data[entity._id]) {
      Object.assign(self.data[entity._id], entity);
      return cb(null, self.data[entity._id]);
    }
    cb(null, null);
  }

  remove(id, cb) {
    const self = this;
    if (self.data[id]) {
      const obj = self.data[id];
      delete self.data[id];
      return cb(null, obj);
    }
    cb(null, null);
  }

  disconnect(cb){
    cb && cb();
  }
}

module.exports = InMemoryDB;
