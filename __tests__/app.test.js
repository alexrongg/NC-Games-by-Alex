const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const { categoryData, commentData, reviewData, userData } = require("../db/data/test-data");
require('jest-sorted');

describe("NC games app", () => {
    describe("GET /api/categories", () => {
        test("Respond with status 200 and a body with properties of slug and description" , () => {
            return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({ body: {categories}}) => {
                expect(categories).toHaveLength(7);
                categories.forEach((category) => {
                    expect(category).toHaveProperty("slug"),
                    expect(category).toHaveProperty("description")
                });
            });
        })
    });
});