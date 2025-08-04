import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import cors from "cors";
import * as joi from "joi";
import User from "../../interface/user.interface";

const corsHandler = cors({origin: true});

const userSchema: joi.ObjectSchema<User> = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const createUser = functions.runWith({timeoutSeconds: 540, memory: "8GB"}).https.onRequest(
    (request: any, response: any) => {
      corsHandler(request, response, async () => {
        const body: User = request.body;

        const validation: any = userSchema.validate(body);

        if (validation.error) {
          return response.status(400).send({message: validation.error.details[0].message});
        }

        const {name, email, password}: User = body;

        const userSave = await admin.auth().createUser({email, password});

        await admin.firestore()
            .collection("profiles")
            .doc(userSave.uid)
            .set({
              name,
              email,
            });

        return response.status(201).send({message: "User created successfully"});
      });
    }
);
