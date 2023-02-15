import firebase from "firebase-admin";
import serviceAccount from "../../../firebase-admin-key.json";

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount as any),
	databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export default firebase
