const connection = require("./db/connection");

exports.selectCategories = () => {
    return connection.query("SELECT * FROM categories;").then((results) => {
        return results.rows;
    });
};

exports.selectReview = (reviewID) => {
    return connection.query(`
    SELECT reviews.review_id, reviews.title, reviews.designer, reviews.owner,
    reviews.review_img_url, reviews.review_body, reviews.category, reviews.created_at,
    reviews.votes, 
    COUNT(comments.review_id) AS comment_count 
    FROM reviews 
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`, [reviewID])
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
        if (review.rows[0].votes === null || review.rows[0].votes < 0) {
            return Promise.reject({
                msg : `Patched object must have the form of { inc_votes: newVote } where newVote indicates the change in votes. Votes cannot go below 0`,
                status : 400
            });
        } else {
          return review.rows;
        }l
    });
};

exports.selectUsers = () => {
    return connection.query("SELECT * FROM users;")
    .then((results) => {
        return results.rows;
    });
};

exports.selectReviews = () => {
    return connection.query(`
    SELECT reviews.review_id, reviews.owner, reviews.title, reviews.category, reviews.review_img_url,
    reviews.created_at, reviews.votes, reviews.review_body, reviews.designer,
    COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;`)
    .then((reviews) => {
        return reviews.rows
    });
};