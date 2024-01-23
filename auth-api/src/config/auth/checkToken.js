import jwt from "jsonwebtoken";
import { promisify } from "util";

import AuthException from "./AuthException.js";

import * as secrets from "./../constants/secrets.js";
import * as httpStatus from "./../constants/httpStatus.js";

const BEARER = "bearer ";
const EMPTY_SPACE = " ";
const EMPTY = "";

export default async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization)
      throw new AuthException(
        httpStatus.BAD_REQUEST,
        "Access token is not informed"
      );

    let accessToken = authorization;
    if (accessToken.includes(EMPTY_SPACE)) {
      accessToken = accessToken.split(EMPTY_SPACE)[1];
    } else {
      accessToken = authorization;
    }

    const decoded = await promisify(jwt.verify)(
      accessToken,
      secrets.API_SECRET
    );

    req.authUser = decoded.authUser;
    return next();
  } catch (error) {
    const status = error.status
      ? error.status
      : httpStatus.INTERNAL_SERVER_ERROR;
    return res.status(status).json({
      status: status,
      message: error.message,
    });
  }
};
