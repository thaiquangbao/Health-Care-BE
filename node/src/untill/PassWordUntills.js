const bcrypt = require("bcryptjs");

class PassWordUntills {
  hashPassword = async (password) =>
    new Promise(async (rejects, resolve) => {
      try {
        const saltRounds = 10; // Or whatever number of rounds you want
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(
          password,
          salt
        );
        rejects(hashedPassword);
      } catch (error) {
        console.log(error);
        throw new Error("Error hashing password");
      }
    });
  comparePasswords = async (
    plainPassword,
    hashedPassword
  ) => {
    try {
      const isMatch = await bcrypt.compare(
        plainPassword,
        hashedPassword
      );
      return isMatch;
    } catch (error) {
      throw new Error("Error comparing passwords");
    }
  };
}

module.exports = new PassWordUntills();
