const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const middlewareController = {
  verifyToken: async (req, res, next) => {
    let token = req.headers.authorization;

    // Kiểm tra xem header Authorization có bắt đầu bằng "Bearer " hay không
    if (token && token.startsWith("Bearer ")) {
      // Nếu có, tách chữ "Bearer " ra khỏi token để lấy token chính
      token = token.slice(7);
    }

    const tokenDB = await Token.find();
    const tokenArray = tokenDB.map((dbToken) => dbToken.token);

    if (token) {
      if (tokenArray.includes(token)) {
        jwt.verify(token, process.env.JWT_ACCESS_KEY, async (err, user) => {
          if (err) {
            await Token.deleteOne({ token: token });
            res
              .status(403)
              .json({ success: false, message: "Token is not valid" });
            return;
          }
          req.user = user;
          next();
        });
      } else {
        console.log("Token is not valid or Signed out");
        res.status(401).json({
          success: false,
          message: "Token is not valid or Signed out",
        });
      }
    } else {
      console.log("You're not authorized to access");
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
