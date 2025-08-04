import express, {Request, Response} from "express";
import * as functions from "firebase-functions";
import cors from "cors";
import authMiddleware from "./middleware/auth-middleware";

import Bugsnag from "@bugsnag/js";
import bugsnagPluginExpress from "@bugsnag/plugin-express";

import * as config from "./config/app-config";

config.init();

Bugsnag.start({
  apiKey: functions.config().env.BUGSNAG_API_KEY || process.env.BUGSNAG_API_KEY || "",
  plugins: [bugsnagPluginExpress],
  appVersion: "0.0.0",
  appType: "focus_track_api",
  enabledReleaseStages: ["development", "production"],
  releaseStage: functions.config().env.ENV || process.env.ENV || "",
  user: {
    id: "00",
    name: "FocusTrack API",
    email: "matheus.gonsalvespereira@gmail.com",
  },
});

const app = express();

const bugsnagMiddleware: any = Bugsnag.getPlugin("express");
app.use(bugsnagMiddleware.requestHandler);
app.use(cors({origin: true}));
app.use(bugsnagMiddleware.errorHandler);

app.get("/", (req: Request, res: Response) => {
  Bugsnag.notify(new Error("Test error"), function(event: any) {
    event.context = "API Test";
    event.severity = "info";
    event.unhandled = false;
    event.errors[0].errorClass = "Notification";
    // event.setUser(userID, userEmail, userName);
    event.addMetadata("Details", {
      Description: "The main API endpoint was hit. Someone is testing the API.",
    });
  });

  return res.status(200).send({message: "You should not be here!"});
});

exports.app = functions.runWith({timeoutSeconds: 540, memory: "8GB"}).https.onRequest(app);
