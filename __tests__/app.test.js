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
            .get(`/api/reviews/${REVIEW_ID}`)
            .expect(200)
            .then(({ body }) => {
                expect(body.review).toEqual({
                    review_id: REVIEW_ID,
                    title: "Agricola",
                    designer: 'Uwe Rosenberg',
                    owner: 'mallionaire',
                    review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Farmyard fun!',
                    category: 'euro game',
                    created_at: "2021-01-18T10:00:20.514Z",
                    votes: 1
                });
            });
        })
    });
});

describe("NC games Error handling", () => {
    test("STATUS 404, responds with a message of `invalid path` when requested a invalid path", () => {
        return request(app)
        .get("/api/toiletpaper")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid path")
        });
    });
    test("STATUS 404, responds with a message of `Invalid review ID` when requested a invalid review ID", () => {
        return request(app)
        .get("/api/reviews/12312344")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid review ID")
        });
    });
    test("STATUS 404, responds with a error message when inputted wrong syntax as review ID", () => {
        return request(app)
        .get("/api/reviews/bobby")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid Syntax of review ID, need to be a number")
        });
    });
});