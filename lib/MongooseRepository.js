const IRepository = require('./IRepository');

class MongooseRepository extends IRepository {
  constructor(mongoose, modelName) {
    super(...arguments);

    if (!mongoose || !modelName) throw new Error('Mongoose model type cannot be null.');
    this.mongoose = mongoose;
    this.collection = mongoose.model(modelName);

    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);

    this.clear = this.clear.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  clear(cb){
    this.collection.find({}).remove(cb);
  }

  disconnect(cb){
    this.mongoose.connection.close(cb);
  }
  
  /**
   * get all
   */
  findAll(cb) {
    this.collection.find({}).exec((err, res) => {
      if(err) return cb(err);
      const obj = JSON.parse(JSON.stringify(res));
      return cb(null, obj);
    });
  } 

  /** 
   * find one 
   */
  findOne(id, cb) {
    this.collection.findById({ _id: id }).exec((err, res) => {
      if(err) return cb(err);
      const obj = JSON.parse(JSON.stringify(res));
      return cb(null, obj);
    });
  }

  /**
   * create
   */
  add(entity, cb) {
    this.collection.create(entity, (err, res) => {
      if (err) return cb(err);
      const obj = JSON.parse(JSON.stringify(res));
      cb(null, obj);
    });
  }
  /**
   * update
   */
  update(entity, cb) {
    this.collection.findByIdAndUpdate(entity._id, entity, {
      multi: true,
      new: true,
      passRawResult: true,
      lean: true
    }).exec((err, res)=>{
      if(err) return cb(err);
      const obj = JSON.parse(JSON.stringify(res));
      cb(null, obj);
    });
  }
  
  /**
   * delete
   */
  remove(id, cb) {
    this.collection.findByIdAndRemove(id, (err, res) => {
      if(err) return cb(err);
      const obj = JSON.parse(JSON.stringify(res));
      cb(null, obj);
    });
  }
}

module.exports = MongooseRepository;