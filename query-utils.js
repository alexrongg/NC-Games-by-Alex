const connection = require("./db/connection");

exports.checkCategoryExists = (category) => {
	return connection.query(`SELECT * FROM categories WHERE slug = $1;`, [category]).then((results) => {
		if (results.rows.length !== 0) {
			return true;
		};
		return false
    })
};