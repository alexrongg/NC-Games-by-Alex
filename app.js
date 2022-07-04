const { getCategories, getReview } = require("./controllers");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReview)

app.use("*", (req, res) => {
    res.status(404).send({msg: "Invalid path"});
});

app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal server error"});
});

module.exports = app;