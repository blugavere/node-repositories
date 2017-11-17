
import { MongooseRepository } from "../../../repositories";
import { Mongoose, Schema } from "mongoose";
import * as mongoose from 'mongoose';

const modelName = 'cats';

// configure a schema somewhere
const schema = new Schema({
  name: { type: String }
});

const Cat = mongoose.model(name, schema);

class CatRepository extends MongooseRepository {
  constructor(){
    super(mongoose, Cat)
  }
}

export default CatRepository;
