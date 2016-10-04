const fs = require('fs');

class FSRepository {
  constructor(strategy, path) {
    console.log('args!', strategy, path);
    if (!path) throw new Error('Absolute file path is required.');
    this.path = path;
    this.strategy = strategy;
    this.setStrategy = this.setStrategy.bind(this);

    this.findAll = this.findAll.bind(this);
    this.add = this.add.bind(this);
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  use(strategy) {
    this.strategy = strategy;
  }

  findAll(cb) {
    console.log(this, this.strategy)
    cb(null, this.strategy.deserialize(fs.readFileSync(this.path, 'utf-8')));
  }

  add(entity, cb) {
    const generateId = () => Math.random().toString(36).substr(2, 9);
    entity._id = generateId();
    
    fs.readFile('data.json', function (err, content) {
      if (err) throw err;
      const data = JSON.parse(content);
      data.push(entity);
      fs.writeFile('data.json', JSON.stringify(data), (err) => {
        if (err) return cb(null, err);
        cb(null, entity);
      });
    });
  }
}

module.exports = FSRepository;



/*

*/



