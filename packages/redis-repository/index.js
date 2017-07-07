
'use strict';

const asyncMap = require('async.map');
const autoBind = require('auto-bind');
const uuid = require('uuid');
const noop = () => {};

class RedisRepository {
  constructor(redis, collection) {
    if (!redis || !collection) {
      throw new Error('Collection is a required param.');
    }
    this.collection = collection;
    this.client = redis.createClient();

    autoBind(this);
  }

  clear(cb) {
    const self = this;
    cb = cb || noop;
    self.client.keys(`${self.collection}|*`, (err, res) => {
      if (err) {
        return cb(err);
      }
      return asyncMap(res, (key, cb) => self.client.del(key, cb), cb);
    });
  }

  disconnect() {
    this.client.quit();
  }

  findAll(cb) {
    const self = this;
    self.client.keys(`${this.collection}|*`, (err, res) => {
      if (err) {
        return cb(err);
      }
      return asyncMap(res, (key, cb) => self.findOne(key.split('|')[1], cb), cb);
    });
  }

  findOne(id, cb) {
    const self = this;
    self.client.get(`${self.collection}|${id}`, (err, res) => {
      if (err) {
        return cb(err);
      }
      cb(null, JSON.parse(res));
    });
  }

  add(entity, options, cb) {
    const self = this;
    // handle optional options
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }
    const id =  entity._id ? entity._id : uuid.v4();
    entity._id = id;

    self.client.set(`${self.collection}|${id}`, JSON.stringify(entity), err => {
      if (err) {
        return cb(err);
      }
      if(options.expire) {
        self.client.expire(`${self.collection}|${id}`, options.expire);
      }
      cb(null, entity);
    });
  }

  update(entity, cb) {
    const self = this;
    self.findOne(entity._id, (err, res) => {
      if (err) {
        return cb(err);
      }
      const modified = Object.assign({}, res, entity);
      self.client.set(`${self.collection}|${entity._id}`, JSON.stringify(modified), err => {
        if (err) {
          return cb(err);
        }
        return cb(null, modified);
      });
    });
  }

  remove(id, cb) {
    const self = this;
    self.findOne(id, (err, data) => {
      self.client.del(`${self.collection}|${id}`, err => {
        if (err) {
          return cb(err);
        }
        return cb(null, data);
      });
    });
  }
}

module.exports = RedisRepository;
