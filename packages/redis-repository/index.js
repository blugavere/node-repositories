
'use strict';

const autoBind = require('auto-bind');
const uuid = require('uuid');

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
    this.client.del(this.collection, err => {
      if (err && cb) {
        cb(err);
      }
      if (cb) {
        cb(null, true);
      }
    });
  }

  disconnect() {
    this.client.quit();
  }

  findAll(cb) {
    this.client.hgetall(this.collection, (err, res) => {
      if (err) {
        return cb(err);
      }
      res = Object.keys(res).map(x => JSON.parse(res[x]));
      cb(null, res);
    });
  }

  findOne(id, cb) {
    this.client.hget(this.collection, id, (err, res) => {
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
    self.client.hset(self.collection, id, JSON.stringify(entity), err => {
      if (err) {
        return cb(err);
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
      self.client.hset(self.collection, entity._id, JSON.stringify(modified), err => {
        if (err) {
          return cb(err);
        }
        return cb(null, modified);
      });
    });
  }

  remove(id, cb) {
    const self = this;
    this.findOne(id, (err, data) => {
      self.client.hdel(self.collection, id, err => {
        if (err) {
          return cb(err);
        }
        return cb(null, data);
      });
    });
  }
}

module.exports = RedisRepository;
