
export class MongoRepository {
    constructor(connection: any, modelName: any, ...args: any[]);
    add(entity: object, cb: () => any): any;
    clear(cb: () => any): void;

    /**
     * Disconnects from mongodb.
     * @param {function} cb - callback
     * @returns {void}
     */
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
