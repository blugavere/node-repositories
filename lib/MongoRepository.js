
'use strict';

const IRepository = require('./IRepository');

class MongoRepository extends IRepository {
  constructor(connection, collection) {
    super(connection, collection);

    if (typeof connection === 'undefined') {
      throw new Error('MongoDB connection is a required parameter.');
    }

    if (typeof collection === 'undefined') {
      throw new Error('Collection is a required parameter.');
    }

    this.connection = connection;
    this.collection = this.connection.collection(collection);

    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.clear = this.clear.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  clear(cb) {
    this.collection
      .drop()
      .then(() => cb(null))
      .catch(err => cb(err));
  }

  disconnect() {
    this.connection.close();
  }

  findAll(cb) {
    this.collection
      .find({}, (err, res) => {
        if (err) return cb(err);
        res.toArray((err, docs) => {
          const obj = JSON.parse(JSON.stringify(docs));
          cb(null, obj);
        });
      });
  }

  findOne(id, cb) {
    const _id = this.collection.s.pkFactory(id);
    this.collection.findOne({ _id }, (err, res) => {
      if (err) return cb(err);
      cb(null, JSON.parse(JSON.stringify(res)));
    });
  }

  add(entity, cb) {
    this.collection.insert(entity, { fullResult: true }, (err, entity) => {
      if (err) return cb(err);
      cb(null, JSON.parse(JSON.stringify(entity.ops[0])));
    });
  }

  update(entity, cb) {
    const _id = this.collection.s.pkFactory(entity._id);
    entity._id = _id;
    this.collection.findAndModify({ _id }, [['_id', 1]], entity, { new: true }, (err, res) => {
      if (err) return cb(err);
      cb(null, JSON.parse(JSON.stringify(res.value)));
    });
  }

  remove(id, cb) {
    const _id = this.collection.s.pkFactory(id);
    this.findOne(id, (err, res) => {
      if (err) return cb(err);

      this.collection.findAndRemove({ _id }, [['_id', 1]], err => {
        if (err) return cb(err);
        return cb(null, res);
      });
    });
  }
}

module.exports = MongoRepository;
