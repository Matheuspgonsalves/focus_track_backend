import cors from "cors";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import joi from "joi";
import Timer from "../../interface/timer.interface";

const corsHandler = cors();

const timerSchema: joi.ObjectSchema<Timer> = joi.object({
  duration: joi.number().required(),
  completedAt: joi.date().required(),
});

export const saveSessionTime = functions.runWith({timeoutSeconds: 540, memory: "8GB"}).https.onRequest(
    (request: any, response: any) => {
      corsHandler(request, response, async () => {
        const body: any = request.body;
        const userId: any = request.jwt.uid;

        const validation: any = timerSchema.validate(body);

        if (validation.error) {
          return response.status(400).send({message: validation.error.details[0].message});
        }

        const {duration, completedAt} = body;

        await admin.firestore()
            .collection("focusSession")
            .doc()
            .set({
              userId,
              duration,
              completedAt: new Date(completedAt),
            });
      });

      return response.status(201).send({message: "Sessão salva com sucesso."});
    }
);
