const {
  getCategories,
  getReview,
  patchReview,
  getUsers,
  getReviews,
  getReviewComments,
  postComment,
  deleteComment,
  getJSON,
} = require("./controllers");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/", getJSON);
app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReview);
app.get("/api/users", getUsers);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getReviewComments);

app.patch("/api/reviews/:review_id", patchReview);

app.post("/api/reviews/:review_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Invalid path" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02" || err.code === "23503") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
