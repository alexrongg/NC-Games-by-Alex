const { getCategories } = require("./controllers");
const express = require("express");
const app = express();

app.get("/api/categories", getCategories);

app.use("*", (req, res) => {
    res.status(404).send({msg: "Invalid path"});
});


app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal server error"});
});

module.exports = app;