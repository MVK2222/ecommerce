import { index } from './algolia';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

db.collection('products').onSnapshot(snapshot => {
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    index.saveObject({
      objectID: doc.id,
      name: data.name,
      description: data.description,
      // Add other fields as needed
    });
  });
});