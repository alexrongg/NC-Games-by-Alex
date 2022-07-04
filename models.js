const connection = require("./db/connection");

exports.requestCategories = () => {
    return connection.query("SELECT * FROM categories;").then((results) => {
        return results.rows
    })
}