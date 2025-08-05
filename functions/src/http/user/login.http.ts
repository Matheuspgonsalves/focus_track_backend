import cors from "cors";
import * as joi from "joi";
import Jwt from "../../interface/jwt.interface";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as jwt from "jsonwebtoken";
import authMiddleware from "../../middleware/auth-middleware";

const corsHandler = cors({origin: true});

const jwtSchema: joi.ObjectSchema<Jwt> = joi.object({
  uid: joi.string().required(),
  email: joi.string().email().required(),
}).unknown(false);

export const jwtAuthentication = functions.runWith({timeoutSeconds: 540, memory: "8GB"}).https.onRequest(
    (request: any, response: any) => {
      corsHandler(request, response, async () => {
        const body: Jwt = request.body;

        const validation: any = jwtSchema.validate(body);

        if (validation.error) {
          return response.status(400).send({message: validation.error.details[0].message});
        }

        try {
          const user: any = await admin.auth().getUser(body.uid);

          if (user.email !== body.email) {
            return response.status(401).send({message: "Invalid user email"});
          }
        } catch (error: any) {
          return response.status(401).send({message: "Invalid user or UID not found"});
        }

        const newAccessToken: string = jwt.sign(body, authMiddleware.MySecretWord, {expiresIn: "24h"});

        return response.send({
          message: "OK",
          newAccessToken,
          profile: {...body},
        });
      });
    }
);
