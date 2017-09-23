'use strict';

const asyncMap = require('async.map');
const autoBind = require('auto-bind');
const uuid = require('uuid');
const pg = require('polygoat');
const noop = () => {};

class RedisRepository {
  constructor(client, collection) {
    if (!client || !collection) {
      throw new Error('Collection is a required param.');
    }
    this.collection = collection;
    this.client = client;
    autoBind(this);
  }

  clear(cb) {
    const self = this;
    cb = cb || noop;
    return pg(done => {
      self.client.keys(`${self.collection}|*`, (err, res) => {
        if (err) {
          return done(err);
        }
        return asyncMap(res, (key, cb) => self.client.del(key, cb), done);
      });
    }, cb);
  }

  disconnect() {
    this.client.quit();
  }

  findAll(cb) {
    const self = this;
    return pg(done => {
      self.client.keys(`${this.collection}|*`, (err, res) => {
        if (err) {
          return done(err);
        }
        return asyncMap(res, (key, cb) => self.findOne(key.split('|')[1], cb), done);
      });
    }, cb);

  }

  findOne(id, cb) {
    const self = this;
    return pg(done => {
      self.client.get(`${self.collection}|${id}`, (err, res) => {
        if (err) {
          return done(err);
        }
        done(null, JSON.parse(res));
      });
    }, cb);
  }

  add(entity, options, cb) {
    const self = this;

    // handle optional options
    if (typeof options === 'function') {
      cb = options;
      options = {};
    } else if(!options) {
      options = {};
    }

    const id = entity._id ? entity._id : uuid.v4();
    entity._id = id;

    return pg(done => {
      self.client.set(`${self.collection}|${id}`, JSON.stringify(entity), err => {
        if (err) {
          return done(err);
        }
        if (options.expire) {
          self.client.expire(`${self.collection}|${id}`, options.expire);
        }
        done(null, entity);
      });
    }, cb);
  }

  update(entity, cb) {
    const self = this;
    return pg(done => {
      self.findOne(entity._id, (err, res) => {
        if (err) {
          return done(err);
        }
        const modified = Object.assign({}, res, entity);
        self.client.set(`${self.collection}|${entity._id}`, JSON.stringify(modified), err => {
          if (err) {
            return done(err);
          }
          return done(null, modified);
        });
      });
    }, cb);
  }

  remove(id, cb) {
    const self = this;
    return pg(done => {
      self.findOne(id, (err, data) => {
        self.client.del(`${self.collection}|${id}`, err => {
          if (err) {
            return done(err);
          }
          return done(null, data);
        });
      });
    }, cb);
  }
}

module.exports = RedisRepository;