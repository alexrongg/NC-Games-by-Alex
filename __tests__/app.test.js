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
    describe("GET /api/reviews/:review_id", () => {
        test("Respond with status 200 and a body full of properties" , () => {
            const REVIEW_ID = 1
            return request(app)
            .get(`/api/parks/${REVIEW_ID}`)
            .expect(200)
            .then(({ body }) => {
                expect(body[0]).toEqual({
                    review_id: REVIEW_ID,
                    title: "Agricola",
                    designer: 'Uwe Rosenberg',
                    owner: 'mallionaire',
                    review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Farmyard fun!',
                    category: 'euro game',
                    created_at: new Date(1610964020514),
                    votes: 1
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