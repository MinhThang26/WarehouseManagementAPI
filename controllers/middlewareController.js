const jwt = require("jsonwebtoken");
const middlewareController = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json("Token is not valid");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You're not authorized to access");
    }
  },
  verifyTokenIsAdmin: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You're not an admin");
      }
    });
  },
  verifyTokenIsStaff: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.isStaff) {
        next();
      } else {
        res.status(403).json("You're not Staff");
      }
    });
  },
  verifyTokenIsOwner: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.isOwner) {
        next();
      } else {
        res.status(403).json("You're not Owner");
      }
    });
  },
};
module.exports = middlewareController;
