
class PostgreRepository {
  constructor(sequelize, modelType) {
    this.sequelize = sequelize;
    if (modelType === undefined) {
      throw new Error('Postgre model type cannot be null.');
    }
    this.collection = sequelize.model(modelType);

    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.clear = this.clear.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }
  clear(cb) {
    this.collection.truncate().then(() => {
      if (cb) {
        cb(null, true);
      }
    }, err => cb && cb(err));
  }
  disconnect() {
    this.sequelize.close();
  }
  /**
   * /get
  */
  findAll(cb) {
    this.collection.findAll({raw: true}).then(data => {
      cb(null, data);
    }, err => cb(err));
  }

  /**
   * get /:id
  */
  findOne(id, cb) {
    this.collection.findById(id, {raw: true}).then(data => {
      cb(null, data);
    }, err => cb(err));
  }

  /**
   * create
   */
  add(entity, cb) {
    this.collection.create(entity).then(data => {
      cb(null, data.toJSON());
    }, err => cb(err));
  }

  /**
   * update
   */
  update(entity, cb) {
    this.collection.update(entity, {
      where: {_id: entity._id},
      raw: true,
      returning: true
    }).then(data => {
      cb(null, data[1][0]);
    }, err => cb(err));
  }

  /**
   * delete
  */
  remove(id, cb) {
    const self = this;
    self.findOne(id, (err, data) => {
      self.collection.destroy({where: {_id: id}, raw: true}).then(() => {
        cb(null, data);
      }, err => cb(err));
    });
  }

}

module.exports = PostgreRepository;
