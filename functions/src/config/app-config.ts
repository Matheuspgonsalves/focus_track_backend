import "dotenv/config";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export function init() {
  const firebaseProjectID: any = functions.config().env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "";

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${firebaseProjectID}-default-rtdb.firebaseio.com`,
  });
}
