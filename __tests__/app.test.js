const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const connection = require("../db/connection")
const { categoryData, commentData, reviewData, userData } = require("../db/data/test-data");
require('jest-sorted');

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));

afterAll(() => connection.end());

describe("NC games app", () => {
    describe("GET /api/categories", () => {
        test("Respond with status 200 and a body with properties of slug and description" , () => {
            return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({body}) => {
                expect(body).toHaveLength(4);
                body.forEach((category) => {
                    expect(category).toHaveProperty("slug"),
                    expect(category).toHaveProperty("description")
                });
            });
        })
    });
});

describe("NC games Error handling", () => {
    test("STATUS 404, responds with a message of `invalid path` when requested a invalid path", () => {
        return request(app)
        .get("/app/toiletpaper")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid path")
        });
    });
});