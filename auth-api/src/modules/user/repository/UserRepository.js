import User from "./../model/User.js";

class UserRepository {
  constructor() {}

  async findByEmail(email) {
    try {
      return await User.findOne({ where: { email: email } });
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }

  async findById(id) {
    try {
      return await User.findOne({ where: { id: id } });
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }
}

export default new UserRepository();
