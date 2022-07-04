const { requestCategories} = require("./models");
const { request } = require("./app")

exports.getCategories = (req, res, next) => {
    requestCategories().then((data) => {
        res.status(200).send(data); 
    })
    .catch((err) => {
        next(err);
    });
    
};