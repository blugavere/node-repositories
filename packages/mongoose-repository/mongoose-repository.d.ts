
import { Mongoose } from 'mongoose';

export class MongooseRepository {
    constructor(mongoose: Mongoose, modelName: any, ...args: any[]);
    add(entity: object, cb: (err, doc) => any): any;
    clear(cb: (err?) => any): void;
    disconnect(cb: (err?) => any): void;
    findAll(cb: (err, docs) => any): any;
    findOne(id: string, cb: (err, doc) => any): any;
    remove(id: string, cb: (err, doc?) => any): any;
    update(entity: any, cb: (err, doc?) => any): any;
    static defaultMaxListeners: number;
    static init(): void;
    static listenerCount(emitter: any, type: any): any;
}
