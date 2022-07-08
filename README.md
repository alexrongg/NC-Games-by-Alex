# Northcoders Games

Solo project for backend section of Northcoders FULLSTACK bootcamp

## Host

Heroku hosted version of project can be found here [here.](https://alex-games.herokuapp.com/)

## API

This API exposes a number of endpoints to retrieve data from a persistent data source. It's written in JavaScript, using Node.js and express for the backend alongside PostgreSQL. A testing suite, which utilises [Jest](https://www.npmjs.com/package/jest), is also included.

**Full list of available endpoints [here.](https://alex-games.herokuapp.com/api)**

## Cloning

1. Fork and clone this repo.
2. Run `npm install` in terminal to install all required dependencies.
3. To connect this database locally, you must create your own environment variables in root directory:

   1. **Test environment** Create ".env.test" file and insert the line "PGDATABASE=nc_games_test"

   2. **Development environment** Create ".env.development" file and insert the line "PGDATABASE=nc_games"

4. Run `npm run setup-dbs` to create 2 seperate databases for testing and development.
5. Run `npm run seed` to seed the development database.
6. Run `npm run prepare` to setup husky.
7. The seed for test database will be automatically seeded and tested everytime `npm test app.test.js` is ran.
8. `npm test <file_path>` can be used to run a single testing file.
9. `npm test` can be used to run the entire test suite.

## Versions

This project was developed using version 18.3.0 of Node, and version 8.7.3 of [node-postgres](https://www.npmjs.com/package/pg)
