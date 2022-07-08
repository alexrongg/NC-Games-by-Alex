const e = require("express");
const connection = require("./db/connection");
const { checkCategoryExists } = require("./query-utils")

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
                msg : `No review found for review ID ${reviewID}`,
                status: 404
            });
        }else {
            return review.rows[0];  
        }; 
    });
};

exports.selectUsers = () => {
    return connection.query("SELECT * FROM users;")
    .then((results) => {
        return results.rows;
    });
};

exports.selectReviews = (sort_by = "created_at", order_by = "DESC", category) => {
    const validQueries = [
        "owner",
        "title",
        "review_id",
        "category",
        "review_img_url",
        "created_at",
        "votes",
        "review_body",
        "designer",
        "comment_count",
        "DESC",
        "ASC"
    ];

    let query = 
    `SELECT reviews.review_id, reviews.owner, reviews.title, reviews.category, reviews.review_img_url,
    reviews.created_at, reviews.votes, reviews.review_body, reviews.designer,
    COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id`;

    return checkCategoryExists(category)
    .then((results) => {
        console.log(results)
        if(category !== undefined) {
            if (results === true){
                query += ` WHERE reviews.category='${category}'`
            }else {
            return Promise.reject({
                msg : `Category name ${category} was not found`,
                status: 404
            });
            }
        }
        if (validQueries.includes(sort_by)) {
            query += ` GROUP BY reviews.review_id ORDER BY reviews.${sort_by} ${order_by}`
        }; 
        return connection.query(query)
    }).then((reviews) => {
        return reviews.rows
    }).catch((err) => {
        console.log(err)
        if (err.code === "42803") { 
            err.msg = "Invalid sort_by query" ;
            err.status = 400 ;
    };
        if (err.code === "42601") {
            err.msg = "Invalid order_by query";
            err.status = 400;
        }
        return Promise.reject(err);
    });
};

exports.selectReviewComments = (review_id) => {
    return connection.query(`
    SELECT * FROM comments
    WHERE review_id = $1;`, [review_id])
    .then((comments) => {
        if (comments.rows.length === 0) {
            return Promise.reject({
                msg : "Invalid review ID or this review has no comments",
                status: 404
            });
        } else {
        return comments.rows;
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

exports.insertComment = (review_id, username, body) => {
    return this.selectReview(review_id)
    .then((results) => {
        if (typeof results !== "object") {
            return Promise.reject({
                "msg": `No review found for review ID ${review_id}`,
                "status": 404
              });
        }
        return connection.query(`
        INSERT INTO comments 
            (review_id, body, author)
        VALUES
            ($1 , $3,  $2)
            RETURNING *;`, [review_id, username, body])
    }).then((comment) => {
            return comment.rows ;    
        }).catch((err) => {
            return Promise.reject(err)
        });   
};

