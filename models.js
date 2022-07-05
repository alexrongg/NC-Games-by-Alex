const connection = require("./db/connection");

exports.selectCategories = () => {
    return connection.query("SELECT * FROM categories;").then((results) => {
        return results.rows;
    });
};

exports.selectReview = (reviewID) => {
    return connection.query("SELECT * FROM reviews WHERE review_id = $1;", [reviewID])
    .then((review) => {
        if (review.rows.length === 0) {
            return Promise.reject({
                msg : "Invalid review ID",
                status: 404
            });
        }else {
            return review.rows[0];  
        }; 
    });
};

exports.updateReview = (review_id, inc_votes) => {
    return connection.query(
    `SELECT review_id, title, designer, owner, review_img_url, review_body, category, created_at, (votes + $2) AS votes 
    FROM reviews 
    WHERE review_id = $1;`, [review_id, inc_votes])
    .then((review) => {
        return review.rows
    });
};
