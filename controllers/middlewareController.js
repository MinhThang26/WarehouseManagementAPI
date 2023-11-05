const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const middlewareController = {
  verifyToken: async (req, res, next) => {
    const token = req.headers.authorization;
    const tokenDB = await Token.find();
    const tokenArray = tokenDB.map((dbToken) => dbToken.token);
    if (token) {
      const tokenAccess = token.split(" ")[1];
      if (tokenArray.includes(tokenAccess)) {
        jwt.verify(
          tokenAccess,
          process.env.JWT_ACCESS_KEY,
          async (err, user) => {
            if (err) {
              await Token.deleteOne({ token: tokenAccess });
              res
                .status(403)
                .json({ success: false, message: "Token is not valid" });
              return;
            }
            req.user = user;
            next();
          }
        );
      } else {
        res
          .status(401)
          .json({
            success: false,
            message: "You're not authorized to access or Signed out",
          });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "You're not authorized to access" });
    }
  },
  verifyTokenIsAdmin: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res
          .status(403)
          .json({ success: false, message: "You're not an admin" });
      }
    });
  },

  verifyTokenIsOwner: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.isOwner) {
        next();
      } else {
        res.status(403).json({ success: false, message: "You're not Owner" });
      }
    });
  },
};
module.exports = middlewareController;
