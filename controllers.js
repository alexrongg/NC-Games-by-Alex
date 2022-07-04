const { selectCategories} = require("./models");
const { request } = require("./app")

exports.getCategories = (req, res, next) => {
    selectCategories().then((data) => {
        res.status(200).send(data); 
    })
    .catch((err) => {
        next(err);
    });
    
};