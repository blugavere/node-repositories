
export class MongooseRepository {
    constructor(mongoose: any, modelName: any, ...args: any[]);
    add(entity: object, cb: () => any): any;
    clear(cb: () => any): void;
    disconnect(cb: () => any): void;
    findAll(cb: () => any): any;
    findOne(id: string, cb: () => any): any;
    remove(id: string, cb: () => any): any;
    update(entity: any, cb: () => any): any;
    static defaultMaxListeners: number;
    static init(): void;
    static listenerCount(emitter: any, type: any): any;
    static usingDomains: boolean;
}
