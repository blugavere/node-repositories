const EventEmitter = require('events').EventEmitter;

class IRepository extends EventEmitter {
  constructor() {
    super();
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.update = this.update.bind(this);
  }

  findAll(cb) {
    cb(new Error('Not Implemented Exception'));
  }
  findOne(id, cb) {
    cb(new Error('Not Implemented Exception'));
  }
  add(entity, cb) {
    cb(new Error('Not Implemented Exception'));
  }

  remove(id, cb) {
    cb(new Error('Not Implemented Exception'));
  }

  update(entity, cb) {
    cb(new Error('Not Implemented Exception'));
  }

}

module.exports = IRepository;