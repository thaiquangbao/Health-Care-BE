const jwt = require("jsonwebtoken");
class JWTService {
  async generateTokens(user, expire) {
    const accessToken = jwt.sign(
      user,
      process.env.SECRETKEY,
      { expiresIn: process.env.ACCESSEXPIRES }
    );
    const refreshToken = jwt.sign(
      user,
      process.env.SECRETKEY,
      {
        expiresIn: expire
          ? expire
          : process.env.REFRESHEXPIRES,
      }
    );
    return {
      accessToken,
      refreshToken,
    };
  }
}
module.exports = new JWTService();
