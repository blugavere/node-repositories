
import { expect } from "chai";
import firebase from "firebase";
import { FirestoreRepository } from "../src";
import { config as dotenv } from "dotenv";

dotenv();

/**
 * mocha test/*.ts --watch
 */
const logCtx = "@test.firestore";
describe("Firestore Repository", () => {
    let repo: FirestoreRepository;

    before(async () => {
        const config = JSON.parse(process.env.FIRESTORE_CONFIG);
        const credentials = JSON.parse(process.env.FIRESTORE_CREDENTIALS);

        firebase.initializeApp(config);
        const db = firebase.firestore();

        // Disable deprecated features
        db.settings({
            timestampsInSnapshots: true,
        });

        const auth = firebase.auth();
        await auth.signInWithEmailAndPassword(credentials.user, credentials.password);
        const cats = db.collection("cats");
        repo = new FirestoreRepository(cats);

    });

    after(() => {
        return firebase.app().delete();
    });

    describe("Repository Implementation", () => {
        let _id;

        it("should add", async () => {
            const result = await repo.add({ name: "foo" });
            console.log(logCtx, `Add Result ${JSON.stringify(result)}`);
            _id = result._id;
            expect(result).to.exist;
            // console.log(logCtx, "Created Id", _id);
        });

        it("should findAll", async () => {
            const result = await repo.findAll();
            expect(result).to.exist;
            expect(result).to.be.an("Array");
            expect(result.length).to.be.greaterThan(0);
            console.log(logCtx, JSON.stringify(result));
            const newRecord = result.find((x) => x._id.toString() === _id.toString());
            expect(newRecord).to.exist;
        });
        
        it("should findOne", async () => {
            const result = await repo.findOne(_id);
            expect(result).to.exist;
            expect(result.name).to.equal("foo");
            expect(result._id).to.exist;
            expect(result._id).to.equal(_id);
        });

        it("should findOne - null handling", async () => {
            const result = await repo.findOne('zz');
            expect(result).to.be.null;
        });

        it("should update", async () => {
            const result = await repo.update({
                _id,
                name: "bar",
            });
            // console.log(logCtx, `Update Result ${JSON.stringify(result)}`);
            expect(result).to.exist;
            expect(result.name).to.equal("bar");
        });

        it("should update - null", async () => {
            const result = await repo.update({
                _id: 'zz',
                name: "bar",
            });
            expect(result).to.be.null;
        });

        it("should remove", async () => {
            const result = await repo.remove(_id);
            // console.log(logCtx, `Remove Result ${JSON.stringify(result)}`);
            expect(result.name).to.exist;
        });
    });

});
