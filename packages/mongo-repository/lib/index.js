'use strict';

/**
 * IRepository implementation for MongoDB
 * @class MongoRepository
 */
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

  /**
   * Truncates a collection.
   * @param {function} cb - callback
   * @returns {void}
   */
  clear(cb) {
      this.collection
        .drop()
        .then(() => cb(null))
        .catch(err => cb(err));
    }
    /**
     * Disconnects from mongodb.
     * @param {function} cb - callback
     * @returns {void}
     */
  disconnect() {
    this.connection.close();
  }

  /**
   * Finds all instances in the collection.
   * @param {function} cb - callback
   * @returns {void}
   */
  findAll(cb) {
      const self = this;
      return new Promise((resolve, reject) => {
        self.collection.find({}, (err, res) => {
          if (err) {
            reject(err);
            if (cb) {
              return cb(err);
            }
          }
          res.toArray((err, docs) => {
            if (err) {
              reject(err);
              if (cb) {
                return cb(err);
              }
            }
            const obj = JSON.parse(JSON.stringify(docs));
            cb(null, obj);
          });
        });
      });
    }

  /**
   * Find an object.
   * @param {string} id - Object Id
   * @param {function} cb - callback
   * @returns {void}
   */
  findOne(id, cb) {
      const _id = this.collection.s.pkFactory(id);
      this.collection.findOne({
        _id
      }, (err, res) => {
        if (err) {
          return cb(err);
        }
        cb(null, JSON.parse(JSON.stringify(res)));
      });
    }
    /**
     * Create an entity.
     * @param {object} entity - Object to create.
     * @param {function} cb - callback
     * @returns {void}
     */
  add(entity, cb) {
    const self = this;
    self.collection.insert(entity, {
      fullResult: true
    }, (err, entity) => {
      if (err) {
        return cb(err);
      }
      cb(null, JSON.parse(JSON.stringify(entity.ops[0])));
    });
  }

  /**
   * Update an entity.
   * @param {object} entity - Object to update.
   * @param {function} cb - callback
   * @returns {void} - async
   */
  update(entity, cb) {
    const _id = this.collection.s.pkFactory(entity._id);
    entity._id = _id;
    this.collection.findAndModify({
      _id
    }, [
      ['_id', 1]
    ], entity, {
      new: true
    }, (err, res) => {
      if (err) {
        return cb(err);
      }
      cb(null, JSON.parse(JSON.stringify(res.value)));
    });
  }

  /**
   * Delete an entity.
   * @param {string} id - Entity Id
   * @param {function} cb - callback
   * @returns {void} - async
   */
  remove(id, cb) {
    const self = this;
    const _id = self.collection.s.pkFactory(id);
    self.findOne(id, (err, res) => {
      if (err) {
        return cb(err);
      }

      self.collection.findAndRemove({
        _id
      }, [
        ['_id', 1]
      ], err => {
        if (err) {
          return cb(err);
        }
        return cb(null, res);
      });
    });
  }
}

module.exports = MongoRepository;
