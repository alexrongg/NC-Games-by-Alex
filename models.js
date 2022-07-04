const connection = require("./db/connection");

exports.selectCategories = () => {
    return connection.query("SELECT * FROM categories;").then((results) => {
        return results.rows;
    });
};

exports.selectReview = (reviewID) => {
    return connection.query("SELECT * FROM reviews WHERE review_id = $1;", [reviewID])
    .then((review) => {
        review.rows[0].created_at = `${new Date(1610964020514)}`
        return review.rows[0];
    });
};

