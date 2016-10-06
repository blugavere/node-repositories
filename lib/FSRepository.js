const IRepository = require('./IRepository');
const fs = require('fs');
const path = require('path');
const stackTrace = require('stack-trace');
const JSONSerializer = require('./serializers/JSONSerializer');

class FSRepository extends IRepository {
  constructor(filePath, strategy) {
    super(...arguments);
    const trace = stackTrace.get();
    const caller = trace[1].getFileName();
    if (!path) throw new Error('File path is required.');

    this.path = path.isAbsolute(filePath) ? filePath : path.join(path.dirname(caller), filePath);//filePath;

    this.strategy = strategy || new JSONSerializer();
    this.setStrategy = this.setStrategy.bind(this);
    this.read = this.read.bind(this);
    this.write = this.write.bind(this);

    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.clear = this.clear.bind(this);

  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  use(strategy) {
    this.strategy = strategy;
  }

  clear() {
    return fs.writeFileSync(this.path, this.strategy.serialize(''), 'utf-8');
  }

  disconnect(){
    
  }

  read(path, cb) {
    const self = this;
    fs.open(path, 'r', err => {
      if (err) {
        fs.writeFile(path, self.strategy.serialize({}), err => {
          if (err) {
            return cb(err, null);
          }
          return cb(null, {});
        });
      } else {
        return cb(null, this.strategy.deserialize(fs.readFileSync(path, 'utf-8')));
      }
    });
  }

  write(path, data, cb) {
    fs.open(path, 'r+', err => {
      if (err) {
        fs.writeFile(path, '', err => {
          if (err) {
            return cb(err, null);
          }
          return cb(null, true);
        });
      } else {
        const str = this.strategy.serialize(data);
        fs.writeFile(path, str, err => {
          if (err) {
            return cb(err, null);
          }
          return cb(null, true);
        });
      }
    });
  }

  findAll(cb) {
    this.read(this.path, (err, data) => {
      if (err) {
        return cb(err);
      }
      cb(null, Object.values(data));
    });
  }

  findOne(id, cb) {
    this.read(this.path, (err, data) => {
      if (err) {
        return cb(err);
      }
      cb(null, data[id]);
    });
  }

  update(entity, cb) {
    const self = this;
    this.read(this.path, (err, data) => {
      data[entity._id] = entity;
      self.write(self.path, data, err => {
        if (err) return cb(err);
        return cb(null, entity);
      });
    });
  }

  add(entity, cb) {
    const self = this;
    this.read(this.path, (err, data) => {
      const generateId = () => Math.random().toString(36).substr(2, 9);
      entity._id = generateId();
      data[entity._id] = entity;
      self.write(self.path, data, err => {
        if (err) return cb(err);
        return cb(null, entity);
      });
    });
  }

  remove(id, cb) {
    const self = this;
    this.read(this.path, (err, data) => {
      const copy = Object.assign({}, data[id]);
      delete data[id];
      self.write(self.path, data, err => {
        if (err) {
          return cb(err);
        }
        cb(null, copy);
      });
    });

  }
}

module.exports = FSRepository;
