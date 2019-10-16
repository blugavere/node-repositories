
# Firebase Repository

> Generic repository implementation using Firebase

```ts

const catsCollection = firebase.database().ref().child('cats');
const repo = new FirebaseRepository(catsCollection);

(() => {
    const cat = await repo.add({ name: "delilah" });
    const foundCat = await repo.findOne(cat._id);

})();

```