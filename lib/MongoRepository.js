class MongoRepository {
  constructor(connection, collection) {
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
      .find()
      .toArray()
      .then(records => cb(null, records))
      .catch(err => cb(err));
  }

  findOne(_id, cb) {
    this.collection
      .findOne({_id})
      .then(record => cb(null, record))
      .catch(err => cb(err));
  }

  add(entity, cb) {
    this.collection
      .insertOne(entity)
      .then(record => cb(null, record.ops[0]))
      .catch(err => cb(err));
  }

  update(entity, cb) {
    this.collection
      .updateOne({_id: entity._id}, entity)
      .then(record => {
        if (record.modifiedCount !== 1) {
          throw new Error('Could not update entity because no matching entry was found in the database.');
        }

        cb(null, entity);
      })
      .catch(err => cb(err));
  }

  remove(_id, cb) {
    this.findOne(_id, (findErr, data) => {
      if (findErr) {
        return cb(findErr);
      }

      this.collection
        .deleteOne({_id})
        .then(() => cb(null, data))
        .catch(err => cb(err));
    });
  }
}

module.exports = MongoRepository;
