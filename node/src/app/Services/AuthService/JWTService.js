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
  async generateTokenZego(user, expire) {
    const accessToken = jwt.sign(
      user,
      process.env.SECRETKEY,
      { expiresIn: process.env.ACCESSZEGO }
    );
    const refreshToken = jwt.sign(
      user,
      process.env.SECRETKEY,
      {
        expiresIn: expire
          ? expire
          : process.env.REFRESHZEGO,
      }
    );
    return {
      accessToken,
      refreshToken,
    };
  }
}
module.exports = new JWTService();
