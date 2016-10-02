const redis = require('redis');
const _ = require('lodash');

class RedisRepository {
  constructor(collection) {
    if (!collection) {
      throw new Error('Collection is a required param.');
    }
    this.client = redis.createClient();

    /** bind */
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.update = this.update.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);

    this.clear = this.clear.bind(this);

    this.disconnect = this.disconnect.bind(this);
    this.collection = collection;
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
  disconnect(){
    this.client.quit();
  }
  findAll(cb) {
    this.client.hgetall(this.collection, (err, res) => {
      if (err) {
        return cb(err);
      }
      res = _.values(res).map(x => JSON.parse(x));
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

  add(entity, cb) {
    const generateId = () => Math.random().toString(36).substr(2, 9);
    entity._id = generateId();
    this.client.hset(this.collection, entity._id, JSON.stringify(entity), (err, data) => {
      if (err) {
        return cb(err);
      }
      cb(null, entity);
    });
  }

  update(entity, cb) {
    const self = this;
    this.findOne(entity._id, (err, res) => {
      if (err) {
        return cb(err);
      }
      const modified = Object.assign({}, res, entity);
      self.client.hset(self.collection, entity._id, JSON.stringify(modified), (err, data) => {
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
