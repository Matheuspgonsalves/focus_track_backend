import "dotenv/config";
import * as functions from "firebase-functions";
import * as jwt from "jsonwebtoken";

const MySecretWord: any = functions.config().env.JSON_WEB_TOKEN || process.env.JSON_WEB_TOKEN;

const checkToken = (req: any, res: any, next: any) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, MySecretWord, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({message: "Token is not valid"});
      }

      req.jwt = {...decoded, token};
      next();
    });
    return;
  }

  return res.status(403).json({message: "Auth token is not supplied"});
};

export default {
  MySecretWord,
  checkToken,
};
