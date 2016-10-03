class MongoRepository {
  constructor(connection, collection) {
    if (typeof connection === 'undefined') {
      throw new Error('MongoDB connection is a required parameter.');
    }

    if (typeof collection === 'undefined') {
      throw new Error('Collection is a required parameter.');
    }

    this.connection = connection;
    this.collection = collection;

    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.clear = this.clear.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  clear(cb) {

  }

  disconnect(cb) {

  }

  findAll(cb) {

  }

  findOne(id, cb) {

  }

  add(entity, cb) {

  }

  update(entity, cb) {

  }

  remove(id, cb) {

  }
}

module.exports = MongoRepository;
