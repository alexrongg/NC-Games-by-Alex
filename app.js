const { getCategories, getReview, patchReview, getUsers, getReviews } = require("./controllers");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReview);
app.get("/api/users", getUsers);
app.get("/api/reviews", getReviews);

app.patch("/api/reviews/:review_id", patchReview);

app.use("*", (req, res) => {
    res.status(404).send({msg: "Invalid path"});
});

app.use((err, req, res, next) => {
    if (err.msg === 'Invalid review ID') {
        res.status(404).send(err)
    } else if (err.code === "22P02") {
        res.status(400).send({ msg: "Invalid Syntax of review ID, need to be a number"})
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