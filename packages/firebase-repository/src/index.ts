
import { database } from "firebase";
import util from "util";

export class FirebaseRepository<T extends IEntity = any> implements IRepository<T> {
    constructor(
        private ref: database.Reference,
    ) {
        this.set = this.set.bind(this);
        this.get = this.get.bind(this);
        this.findAll = this.findAll.bind(this);
        this.findOne = this.findOne.bind(this);
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.update = this.update.bind(this);
    }

    public async set(key: string, value: any): Promise<void> {
        const self = this;
        const ref = self.ref.child(key.toString());
        await ref.set(value);
        return;
    }

    public async get(key: string): Promise<any> {
        return this.findOne(key);
    }

    public async findAll(): Promise<T[]> {
        const self = this;
        const snap = await self.ref.once("value");
        const data = snap.val();
        const result = Object.keys(data)
            .reduce((collection, _id) => {
                const entity = {
                    ...data[_id],
                    _id,
                };
                collection.push(entity);
                return collection;
            }, []);
        return result;
    }

    public async findOne(_id: string): Promise<T | null> {
        const self = this;
        const snap = await self.ref.child(_id).once("value");
        return snap.val();
    }

    /**
     * Returns updated value.
     * @param {any} entity
     * @returns {Promise<Object>} - Updated Key
     * @memberof FirebaseRepository
     */
    public async update(entity: T): Promise<T | null> {
        const self = this;
        const ref = self.ref.child(entity._id);
        const snap = await ref.once("value");
        const data = snap.val();
        const updatedData = Object.assign({}, data, entity);
        await util.promisify(ref.update).bind(ref)(updatedData);
        return updatedData;
    }

    public async add(data): Promise<T> {
        const self = this;
        if (!data._id) {
            const obj = self.ref.push(data);
            const added = { ...data, _id: obj.key };
            return obj.set(data).then(() => added);
        }
        return self.ref.child(data._id).set(data);
    }

    public async remove(id: string): Promise<T | null> {
        const self = this;
        const ref = self.ref.child(id);
        const entity = await self.findOne(id);
        await ref.remove();
        return entity;
    }

}

export interface IEntity {
    _id: any;
}
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type IFindAll<T extends IEntity = any> = () => Promise<T[]>;
export type IFindOne<T extends IEntity = any> = (id: any) => Promise<T | null>;
export type IAdd<T extends IEntity = any> = (entity: Omit<T, "_id">) => Promise<T>;
export type IRemove<T extends IEntity> = (id: string) => Promise<T | null>;
export type IUpdate<T extends IEntity> = (entity: T) => Promise<T | null>;
export interface IRepository<T extends IEntity = any> {
    findAll: IFindAll<T>;
    findOne: IFindOne<T>;
    add: IAdd<T>;
    update: IUpdate<T>;
    remove: IRemove<T>;
}
