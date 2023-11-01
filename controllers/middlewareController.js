const jwt = require("jsonwebtoken");
const middlewareController = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json({ message: "Token is not valid" });
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json({ message: "You're not authorized to access" });
    }
  },
  verifyTokenIsAdmin: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json({ message: "You're not an admin" });
      }
    });
  },

  verifyTokenIsOwner: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.isOwner) {
        next();
      } else {
        res.status(403).json({ message: "You're not Owner" });
      }
    });
  },
};
module.exports = middlewareController;
