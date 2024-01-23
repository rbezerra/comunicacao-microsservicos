import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repository/UserRepository.js";
import * as httpStatus from "./../../../config/constants/httpStatus.js";
import UserException from "../exception/UserException.js";
import * as secrets from "./../../../config/constants/secrets.js";

class UserService {
  async findByEmail(req) {
    try {
      const { email } = req.params;
      const { authUser } = req;
      this.validateRequestData(email);
      let user = await UserRepository.findByEmail(email);
      this.validateUserNotFound(user);
      this.validateAuthenticatedUser(user);

      return {
        status: httpStatus.SUCCESS,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      return {
        status: error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async getAccessToken(req) {
    try {
      const { email, password } = req.body;
      this.validateAccessTokenData(email, password);
      let user = await UserRepository.findByEmail(email);
      await this.validatePassword(password, user.password);
      let authUser = { id: user.id, name: user.name, email: user.email };
      const accesToken = jwt.sign({ authUser }, secrets.API_SECRET, {
        expiresIn: "1d",
      });
      return {
        status: httpStatus.SUCCESS,
        accesToken,
      };
    } catch (error) {
      return {
        status: error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  validateAuthenticatedUser(user, authUser) {
    if (!authUser || user.id !== authUser.id) {
      throw new UserException(
        httpStatus.FORBIDDEN,
        "You canno see this user data"
      );
    }
  }

  validateAccessTokenData(email, password) {
    if (!email || !password) {
      throw new UserException(
        httpStatus.UNAUTHORIZED,
        "Email and password must be informed"
      );
    }
  }

  validateRequestData(email) {
    if (!email)
      throw new UserException(
        httpStatus.BAD_REQUEST,
        "User email was not informed"
      );
  }

  validateUserNotFound(user) {
    if (!user) throw new UserException(httpStatus.NOT_FOUND, "User not found");
  }

  async validatePassword(password, hashPassword) {
    if (!(await bcrypt.compare(password, hashPassword))) {
      throw new UserException(
        httpStatus.UNAUTHORIZED,
        "Password doesn't match"
      );
    }
  }
}

export default new UserService();
