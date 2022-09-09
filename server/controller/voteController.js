const Questionsdb = require("../model/questionDB");

exports.upVote = (req, res) => {
  const tempID = req.url.split("/");
  const questionId = tempID[2].substr(1);

  Questionsdb.find({ questionId: questionId })
    .then((data) => {
      const [votes] = data;
      const newVotes = { votes: votes.votes + 1 };
      console.log(newVotes);
      handleVoteUpdate(votes.id, newVotes);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Erro retrieving Question with id " + questionId });
    });

  const handleVoteUpdate = (id, votes) => {
    Questionsdb.findByIdAndUpdate(id, votes, { useFindAndModify: false })
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

exports.downVote = (req, res) => {
  const tempID = req.url.split("/");
  const questionId = tempID[2].substr(1);

  Questionsdb.find({ questionId: questionId })
    .then((data) => {
      const [votes] = data;
      let newVotes;
      if (votes.votes >= 0) {
        newVotes = { votes: votes.votes - 1 };
        handleVoteUpdate(votes.id, newVotes);
      } else {
        res.status(500).send({ message: "No more Down vote can be done " });
        return;
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Erro retrieving Question with id " + questionId });
    });

  const handleVoteUpdate = (id, votes) => {
    Questionsdb.findByIdAndUpdate(id, votes, { useFindAndModify: false })
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
