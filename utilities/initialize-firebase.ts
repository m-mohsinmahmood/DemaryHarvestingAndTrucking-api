const admin = require('firebase-admin');
import { firebaseConfig } from "../utilities/firebase.config";

export function initializeFirebase() {
    return admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
        databaseURL: "dB_URL"
    });
}