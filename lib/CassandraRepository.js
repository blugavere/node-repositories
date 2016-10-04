const IRepository = require('./IRepository');

//import Sequelize, { define } from 'sequelize';


class CassandraRepository extends IRepository {
  constructor(client, modelType) {
    super(...arguments);

    this.client = client;
    if (modelType === undefined) throw new Error('Postgre model type cannot be null.');

    this.collection = client.instance[modelType];

    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.clear = this.clear.bind(this);
    
    this.disconnect = this.disconnect.bind(this);
  }

  clear(cb) {
    this.collection.delete({}, err => {
      if (err) {
        cb && cb(err);
      }
      cb && cb(null, true);
    });
  }

  disconnect() {
    this.client.close();
  }

  findAll(cb) {
    this.collection.find({}, {raw: true}, (err, data) => {
      if (err) return cb(err);
      cb(null, data);
    });
  }

  findOne(id, cb) {
    this.collection.findOne({_id: id}, {raw: true}, (err, data) => {
      if (err) return cb(err);
      cb(null, data);
    });
  }

  add(entity, cb) {
    const generateId = () => Math.random().toString(36).substr(2, 9);
    entity._id = generateId();

    const model = new this.collection(entity);
    model.save(function (err) {
      if (err) return cb(err);
      cb(null, model.toJSON());
    });
  }

  /**
   * update
   */
  update(data, cb) {
    this.collection.findOne({_id: data._id}, (err, model) => {
      if (err) return cb(err);
      const entity = Object.assign(model, data);
      entity.save(err => {
        if (err) return cb(err);
        cb(null, entity.toJSON());
      });
    });
  }

  /**
   * delete
  */
  remove(id, cb) {
    const self = this;
    self.findOne(id, (err, data) => {
      self.collection.delete({_id: id}, (err, res) => {
        if (err) {
          return cb(err);
        }
        cb(null, data);
      });
    });
  }
}

module.exports = CassandraRepository;
