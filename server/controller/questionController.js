const Questionsdb = require("../model/questionDB");

// Question

// create and save new question
exports.create = (req, res) => {
  // validate request
  if (!req.body.categories) {
    res.status(400).send({ message: "categories can not be emtpy!" });
    return;
  }
  if (!req.body.body) {
    res.status(400).send({ message: "body can not be emtpy!" });
    return;
  } else if (!req.body.body.length > 1) {
    res.status(400).send("body must have atleast 1 character");
  }
  const date = new Date();
  const curDate =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();

  Questionsdb.find()
    .then((list) => {
      const [tempfirstID] = list;
      let questionId;
      if (tempfirstID === undefined) {
        questionId = 1;
      } else {
        const tempID = list.length + 1;
        const found = list.find((element) => element.questionId >= tempID);
        if (!!found) {
          questionId = parseInt(found.questionId) + 1;
        } else {
          questionId = tempID;
        }
      }
      handleCreate(questionId);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error Occurred while retriving user information",
      });
    });

  const handleCreate = (questionId) => {
    const createQuestion = new Questionsdb({
      questionId: questionId,
      body: req.body.body,
      categories: req.body.categories,
      replies: "",
      votes: 0,
      createdOn: curDate.toString(),
      updatedOn: curDate.toString(),
      createdBy: req.body.createdBy,
      updatedBy: req.body.createdBy,
    });

    // save user in the database
    createQuestion
      .save(createQuestion)
      .then((data) => {
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

// retrieve and return all question/ retrive and return a single user
exports.find = (req, res) => {
  if (req.query.id) {
    const questionId = req.query.id;
    Questionsdb.find({ questionId: questionId })
      .then((data) => {
        if (!data) {
          res
            .status(404)
            .send({ message: "Not found Question with id " + questionId });
        } else {
          res
            .status(200)
            .send({ message: "Question1 Fetched Succesfully", data: data });
        }
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Erro retrieving Question with id " + questionId });
      });
  } else {
    Questionsdb.find()
      .then((list) => {
        res
          .status(200)
          .send({ message: "Question2 Fetched Succesfully", data: list });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Error Occurred while retriving Question information",
        });
      });
  }
};

// Update a new idetified user by user id
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" });
  }

  if (req.body.replies) {
    const reply = req.body.replies;
    if (!reply.repliId) {
      res.status(400).send({
        message: "repliId cannot be empty",
      });
      return;
    }
    if (!reply.replyBody) {
      res.status(400).send({
        message: "replyBody cannot be empty",
      });
      return;
    }
    if (!reply.repliedBy) {
      res.status(400).send({
        message: "repliedBy cannot be empty",
      });
      return;
    }
    if (!reply.repliedOn) {
      res.status(400).send({
        message: "repliedOn cannot be empty",
      });
      return;
    }
  }

  const questionId = req.params.id.substr(3);

  Questionsdb.find({ questionId: questionId })
    .then((data) => {
      handleUpdate(data[0].id);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error Occurred while retriving Question information",
      });
    });

  const handleUpdate = (id) => {
    Questionsdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot Update Question with ${questionId}. Maybe Question not found!`,
          });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Error Update Question information" });
      });
  };
};

// Delete a user with specified user id in the request
exports.delete = (req, res) => {
  const questionId = req.params.id.substr(3);

  Questionsdb.find({ questionId: questionId })
    .then((data) => {
      handleDelete(data[0].id);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error Occurred while retriving Question information",
      });
    });

  const handleDelete = (id) => {
    Questionsdb.findByIdAndDelete(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot Delete with id ${questionId}. Maybe id is wrong`,
          });
        } else {
          res.send({
            message: "Question was deleted successfully!",
            data,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete Question with " + questionId,
        });
      });
  };
};

exports.findByCategories = (req, res) => {
  if (!req.body.categories) {
    res.send("Please Mention any Category to fetch the List");
    return;
  }
  Questionsdb.find({ categories:[req.body.categories]})
    .then((list) => {

      res
        .status(200)
        .send({ message: "Question Fetched Succesfully", data: list });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error Occurred while retriving Question information",
      });
    });
};
