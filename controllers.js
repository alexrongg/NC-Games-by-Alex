const { selectCategories, selectReview, updateReview, selectUsers, selectReviews, selectReviewComments} = require("./models");
const { request } = require("./app")

exports.getCategories = (req, res, next) => {
    selectCategories().then((data) => {
        res.status(200).send(data); 
    }).catch((err) => {
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
    });
};

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send(users)
    }).catch((err) => {
        next(err);
    });
};

exports.getReviews = (req, res, next) => {
    selectReviews().then((reviews) => {
        res.status(200).send(reviews)
    }).catch((err) => {
        next(err);
    });
};

exports.getReviewComments = (req, res, next) => {
    const { review_id } = req.params;
    selectReviewComments(review_id).then((comments) => {
        res.status(200).send(comments)
    }).catch((err) => {
        next(err);
    });
};

exports.patchReview = (req, res, next) => {
    const { inc_votes } = req.body;
    const { review_id } = req.params;
    updateReview(review_id, inc_votes).then((review) => {
        res.status(200).send({review})
    }).catch((err) => {
        next(err);
    })
};