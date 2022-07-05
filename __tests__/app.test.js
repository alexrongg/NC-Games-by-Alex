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
    describe("PATCH /api/reviews/:review_id", () => {
        test("Respond with status 200 and a body of the updated review where votes has increased by 25" , () => {
            const voteUpdate = { inc_votes: 25 };
            const REVIEW_ID = 2;
            return request(app)
            .patch(`/api/reviews/${REVIEW_ID}`)
            .send(voteUpdate)
            .expect(200)
            .then(( {body} ) => {
                expect(body.review[0]).toEqual({
                    review_id: REVIEW_ID,
                    title: 'Jenga',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Fiddly fun for all the family',
                    category: 'dexterity',
                    created_at: new Date(1610964101251).toISOString(),
                    votes: 30
                });
            });
        });
    });
    describe("GET /api/users", () => {
        test("Respond with status 200 and a body with properties of username, name and avatar_url" , () => {
            return request(app)
            .get("/api/users")
            .expect(200)
            .then(({body}) => {
                expect(body).toHaveLength(4);
                body.forEach((category) => {
                    expect(category).toHaveProperty("username"),
                    expect(category).toHaveProperty("name"),
                    expect(category).toHaveProperty("avatar_url")
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
    test("STATUS 404, PATCH: responds with a error message when inputted wrong syntax as review ID", () => {
        return request(app)
        .patch("/api/reviews/bobby")
        .send({ inc_votes: 25 })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid Syntax of review ID, need to be a number")
        });
    });
    test("STATUS 404, PATCH: responds with a error message when votes go below existing votes", () => {
        return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: -50 })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe(`Patched object must have the form of { inc_votes: newVote } where newVote indicates the change in votes. Votes cannot go below 0`)
        });
    });
    test("STATUS 404, PATCH: responds with a error message when inputted object has wrong syntax", () => {
        return request(app)
        .patch("/api/reviews/2")
        .send({ toiletpaperwoo: 50 })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe(`Patched object must have the form of { inc_votes: newVote } where newVote indicates the change in votes. Votes cannot go below 0`)
        });
    });
});