const connection = require("./db/connection");

exports.selectCategories = () => {
    return connection.query("SELECT * FROM categories;").then((results) => {
        return results.rows
    })
}