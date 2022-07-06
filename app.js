const { getCategories, getReview, patchReview, getUsers, getReviews, getReviewComments, postComment } = require("./controllers");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReview);
app.get("/api/users", getUsers);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getReviewComments);

app.patch("/api/reviews/:review_id", patchReview);

app.post("/api/reviews/:review_id/comments", postComment);

app.use("*", (req, res) => {
    res.status(404).send({msg: "Invalid path"});
});

app.use((err, req, res, next) => {
    if (err.msg === 'Invalid review ID') {
        res.status(404).send(err)
    } else if (err.code === "22P02") {
        res.status(400).send({ msg: "Invalid Syntax of review ID, need to be a number"})
    } else if (err.code === "23503") {
        res.status(400).send({ msg: "Request body must be {username: [string], body: [string]} and review ID must be a exisitng review ID"})
    } else if (err.msg === "Invalid review ID or this review has no comments") {
        res.status(404).send(err)
    } else if (err.msg) {
        res.status(400).send(err)
    } else {
        next(err);
    };
});

app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal server error"});
});

module.exports = app;