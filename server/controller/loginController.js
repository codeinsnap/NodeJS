var Userdb = require("../model/userDB");
const jwt = require("jsonwebtoken");
const isAuthorized = require("../middlewares/isAuthorization");
const bcrypt = require("bcrypt");

exports.login = (req, res) => {
  if (!req.body.password || !req.body.username) {
    res.status(404).send("invalid username or password");
    return;
  }
  const rex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const email = req.body.username;
  if (!email.match(rex)) {
    res.status(400).send({ message: "Please Enter Correct Email Address" });
    return;
  }

  Userdb.find({ email: req.body.username })
    .then((data) => {
      const [userData] = data;
      if (!userData) {
        res.status(400).send({ message: "invalid Email or UserName" });
        return;
      }
      const token = jwt.sign(req.body.username, process.env.JWT_SECRET);
      try {
        bcrypt.compare(
          req.body.password,
          userData.password,
          function (err, result) {
            if (result) {
              res
                .status(200)
                .send({
                  message: "Login Succesful",
                  data: userData,
                  token: token,
                });
            } else {
              res.status(400).send({ message: "invalid Password" });
              return;
            }
          }
        );
      } catch (e) {
        return done(e);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error Occurred while retriving data",
      });
    });
};
