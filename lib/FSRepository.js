const fs = require('fs');
const path = require('path');
const stackTrace = require('stack-trace');

class FSRepository {
  constructor(strategy, filePath) {
    const trace = stackTrace.get();
    const caller = trace[1].getFileName();
    console.log('called from dir: ', path.dirname(caller));
    console.log('absolute: ', path.join(path.dirname(caller), filePath));


    console.log('called from ', trace[1].getFileName());

    console.log('args!', strategy, filePath);

    if (!path) throw new Error('Absolute file path is required.');

    this.path = path.join(path.dirname(caller), filePath);//filePath;
    this.strategy = strategy;
    this.setStrategy = this.setStrategy.bind(this);
    this.read = this.read.bind(this);
    
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.add = this.add.bind(this);
    //this.update = this.update.bind(this);
    //this.remove = this.remove.bind(this);
    //this.clear = this.clear.bind(this);
   
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  use(strategy) {
    this.strategy = strategy;
  }

  exists(filePath, cb) {
    //open the file and handle error if it's not there.
    cb();
  }

  read(path){
    //open the file and handle error if it's not there.
    
    return this.strategy.deserialize(fs.readFileSync(path, 'utf-8'));
  }
  write(){
    
  }

  findAll(cb) {
    const data = this.read(this.path);
    cb(null, Object.values(data));
  }

  findOne(id, cb) {
    const data = this.read(this.path);
    cb(null, data[id]);
  }
  
  update(entity, cb) {
    const self = this;
    const data = this.read(this.path);
    data[entity._id] = entity;
    fs.writeFile(self.path, JSON.stringify(data), (err) => {
      if (err) return cb(null, err);
      cb(null, entity);
    });
  }

  add(entity, cb) {
    const generateId = () => Math.random().toString(36).substr(2, 9);
    entity._id = generateId();
    const self = this;
    fs.readFile(this.path, function (err, content) {
      if (err) throw err;
      const data = JSON.parse(content);
      data[entity._id] = entity;
      fs.writeFile(self.path, JSON.stringify(data), { flag: 'wx' }, (err) => {
        if (err) return cb(null, err);
        cb(null, entity);
      });
    });
  }

  remove(id, cb) {
    const self = this;
    const data = this.read(this.path);
    const copy = Object.assign({}, data[id]);
    //delete data[id];
    fs.writeFile(self.path, JSON.stringify(data), (err) => {
      if (err) return cb(null, err);
      cb(null, copy);
    });
  }
}

module.exports = FSRepository;



/*

*/



