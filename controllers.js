const { requestCategories} = require("./models");
const { request } = require("./app")

exports.getCategories = (req, res) => {
    requestCategories().then((data) => {
        res.status(200).send(data)   
    });
    
};