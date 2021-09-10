const adminAuth = (req, res, next) => {
  if (req.user.isAdmin) {
    console.log("ok admin");
    next();
  } else {
    console.log("denied admin");
    res.status(403).send("unathorized");
  }
};

module.exports = adminAuth;
