const { selectCategories, selectReview} = require("./models");
const { request } = require("./app")

exports.getCategories = (req, res, next) => {
    selectCategories().then((data) => {
        res.status(200).send(data); 
    })
    .catch((err) => {
        next(err);
    });  
};

exports.getReview = (req, res, next) => {
    const { review_id } = req.params;
    selectReview(review_id).then((review) => {
        res.status(200).send({review})
    })
    .catch((err) => {
        next(err);
    })
};