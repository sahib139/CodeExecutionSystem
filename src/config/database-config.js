const {DataSource} = require("typeorm");
const {DATABASE_PASSWORD,DATABASE_USERNAME} = require("./server-config");

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: "codeQuestions",
  synchronize: false,
  logging: false,
  entities: [
    "src/models/**/*.js"
  ],
  migrations: [
    "src/migration/**/*.js"
  ],
  subscribers: [
    "src/subscriber/**/*.js"
  ],
  cli: {
    entitiesDir: "src/models",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber"
  }
});

module.exports = {AppDataSource};