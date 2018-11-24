
import { expect } from "chai";
import firebase from "firebase";
import { FirebaseRepository } from "../src";
import { config as dotenv } from "dotenv";

dotenv();

/**
 * mocha test/*.ts --watch
 */

describe("Firebase Repository", () => {
    let repo: FirebaseRepository;

    before(async () => {
        const config = JSON.parse(process.env.FIREBASE);
        const credentials = JSON.parse(process.env.FIREBASE_CREDENTIALS);
        firebase.initializeApp(config);
        const auth = firebase.auth();
        await auth.signInWithEmailAndPassword(credentials.user, credentials.password);
        const configs = firebase.database().ref().child("test");
        const testConfig = configs.ref.child("config");
        repo = new FirebaseRepository(testConfig);
    });

    after(() => {
        return firebase.app().delete();
    });

    describe("Repository Implementation", () => {
        let _id;

        it("should add", async () => {
            const result = await repo.add({ name: "foo" });
            // console.log(`Add Result ${JSON.stringify(result)}`);
            _id = result._id;
            expect(result).to.exist;
            // console.log("Created Id", _id);
        });

        it("should findAll", async () => {
            const result = await repo.findAll();
            expect(result).to.exist;
            expect(result).to.be.an("Array");
            expect(result.length).to.be.greaterThan(0);
            // console.log(JSON.stringify(result));
            const newRecord = result.find((x) => x._id.toString() === _id.toString());
            expect(newRecord).to.exist;
        });

        let obj;
        it("should findOne", async () => {
            const result = await repo.findOne(_id);
            expect(result).to.exist;
            expect(result.name).to.equal("foo");
            obj = result;
        });

        it("should get and set", async () => {
            await (async () => {
                const result = await repo.get(_id);
                expect(result.name).to.equal("foo");
            })();
            await repo.set(_id, {
                ...obj,
                name: "baz",
            });
            const result = await repo.get(_id);
            expect(result.name).to.deep.equal("baz");
        });

        it("should update", async () => {
            const result = await repo.update({
                _id,
                name: "bar",
            });
            // console.log(`Update Result ${JSON.stringify(result)}`);
            expect(result).to.exist;
            expect(result.name).to.equal("bar");
        });

        it("should remove", async () => {
            const result = await repo.remove(_id);
            // console.log(`Remove Result ${JSON.stringify(result)}`);
            expect(result.name).to.exist;
        });
    });

});
