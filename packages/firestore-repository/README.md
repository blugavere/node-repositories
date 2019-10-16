
# Firestore Repository

> Generic repository implementation using Firestore

```ts


(() => {

    // one time app setup
    firebase.initializeApp(config);
    const db = firebase.firestore();

    // Disable deprecated features
    db.settings({
        timestampsInSnapshots: true,
    });

    const auth = firebase.auth();
    const credentials = { user: '', password: '', };

    await auth.signInWithEmailAndPassword(credentials.user, credentials.password);

    const catsCollection = db.collection('cats');
    const repo = new FirstoreRepository(catsCollection);
    const cat = await repo.add({ name: 'delilah' });
    const foundCat = await repo.findOne(cat._id);

})();

```
