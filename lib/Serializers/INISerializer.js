const ini = require('ini');

class INISerializer {
  deserialize(data){
    return ini.parse(data);
  }
  serialize(data){
    return ini.stringify(data);
  }  
}

module.exports = INISerializer;
