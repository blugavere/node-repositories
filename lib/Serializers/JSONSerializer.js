class JSONSerializer {
  deserialize(data){
    return JSON.parse(data);
  }
  serialize(data){
    return JSON.stringify(data, null, ' ');
  }
}

module.exports = JSONSerializer;
