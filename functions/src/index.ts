import * as express from "express";
import * as functions from "firebase-functions";

const app = express();

app.get("/");

exports.app = functions.runWith({timeoutSeconds: 540, memory: "8GB"}).https.onRequest(app);
