var Userdb = require("../model/userDB");
const bcrypt = require("bcrypt");

// Users
// create and save new user
exports.create = async (req, res) => {
  // validate request
  if (!req.body.email) {
    res.status(400).send({ message: "email can not be emtpy!" });
    return;
  }
  if (!req.body.password) {
    res.status(400).send({ message: "password can not be emtpy!" });
    return;
  }
  if (!req.body.confirmPassword) {
    res.status(400).send({ message: "confirm Password can not be emtpy!" });
    return;
  }
  if (req.body.password !== req.body.confirmPassword) {
    res
      .status(400)
      .send({ message: "Confirm Password and Password should be same" });
    return;
  }

  //email validation
  const rex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const email = req.body.email;
  if (!email.match(rex)) {
    res.status(400).send({ message: "Please Enter Correct Email Address" });
    return;
  }

  //Hash Password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  Userdb.find()
    .then((user) => {
      const [tempfirstID] = user;
      let userID;
      if (tempfirstID === undefined) {
        userID = 1;
      } else {
        const tempID = user.length + 1;
        const found = user.find((element) => element.userId >= tempID);
        if (!!found) {
          userID = parseInt(found.userId) + 1;
        } else {
          userID = tempID;
        }
      }
      handleCreate(userID);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error Occurred while retriving user information",
      });
    });

  const handleCreate = (userID) => {
    // new user
    const createUser = new Userdb({
      userId: userID,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      saveQuestions: req.body.saveQuestions,
    });

    // save user in the database
    createUser
      .save(createUser)
      .then((data) => {
        //res.send(data)
        // res.redirect('/users/login');
        res
          .status(200)
          .send({ message: "Data Created Succesfully", data: { data } });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while creating a create operation",
        });
      });
  };
};

// retrieve and return all users/ retrive and return a single user
exports.find = (req, res) => {
  if (req.query.userId) {
    const userId = req.query.userId;

    Userdb.findById(userId)
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "Not found user with id " + userId });
        } else {
          res
            .status(200)
            .send({ message: "User Details Fetched Succesfully", data: data });
        }
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Erro retrieving user with id " + userId });
      });
  } else {
    Userdb.find()
      .then((user) => {
        res
          .status(200)
          .send({ message: "Users Fetched Succesfully", data: user });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Error Occurred while retriving user information",
        });
      });
  }
};

// Update a new idetified user by user id
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" });
  }

  const userId = req.params.id.substr(3);

  Userdb.find({ userId: userId })
    .then((user) => {
      handleUpdate(user[0].id);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error Occurred while retriving Question information",
      });
    });

  const handleUpdate = (id) => {
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          console.log(data);
          res.status(404).send({
            message: `Cannot Update user with ${userId}. Maybe user not found!`,
          });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Error Update user information" });
      });
  };
};

// Delete a user with specified user id in the request
exports.delete = (req, res) => {
  const userId = req.params.id.substr(7);

  Userdb.find({ userId: userId })
    .then((user) => {
      console.log(user);
      user && handleDelete(user[0]?.id);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error Occurred while retriving Question information",
      });
    });

  const handleDelete = (id) => {
    Userdb.findByIdAndDelete(id)
      .then((data) => {
        if (!data) {
          res
            .status(404)
            .send({
              message: `Cannot Delete with id ${userId}. Maybe id is wrong`,
            });
        } else {
          res.send({
            message: "User was deleted successfully!",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete User with " + userId,
        });
      });
  };
};
