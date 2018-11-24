
const mapSnapshotToEntity = <T = any>(snap): T => ({
    ...snap.data(),
    _id: snap.id,
});

export class FirestoreRepository<T extends IEntity = any> implements IRepository<T> {
    constructor(
        private collection,
    ) {
        // this.set = this.set.bind(this);
        this.get = this.get.bind(this);
        this.findAll = this.findAll.bind(this);
        this.findOne = this.findOne.bind(this);
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.update = this.update.bind(this);
    }

    public async add(data: Omit<T, "_id">): Promise<T> {
        const { collection } = this;
        const ref = await collection.add(data);
        const snap = await ref.get();
        return mapSnapshotToEntity(snap);
    }

    public async get(key: string): Promise<any> {
        return this.findOne(key);
    }

    public async findAll(): Promise<T[]> {
        const { collection } = this;
        const querySnapshot = await collection.get();
        const docs = [];
        querySnapshot.forEach((doc) => docs.push(mapSnapshotToEntity(doc)));
        return docs;
    }

    public async findOne(_id: string): Promise<T | null> {
        const { collection } = this;
        const snap = await collection.doc(_id).get();
        if(!snap.exists) {
            return null;
        }
        return mapSnapshotToEntity(snap);
    }

    public async update(entity: Partial<T>): Promise<T | null> {
        const { collection } = this;
        const ref = await collection.doc(entity._id);

        try {
            await ref.update(entity);
        } catch(e) {
            if(e.code == 'not-found') {
                return null
            }
            throw e;
        }

        const snap = await ref.get();
        return mapSnapshotToEntity(snap);
    }

    public async remove(id: string): Promise<T | null> {
        const { collection } = this;
        const ref = collection.doc(id);
        const snap = await ref.get();
        if(!snap.exists) {
            return null
        }
        await ref.delete();
        return mapSnapshotToEntity(snap);
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
