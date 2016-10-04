const fs = require('fs');

class FSRepository {
  constuctor(path) {
    if (!path) throw new Error('Absolute file path is required.');
    
    this.setStrategy = this.setStrategy.bind(this);
  }
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  findAll() {

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