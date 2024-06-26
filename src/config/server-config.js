const dotenv = require("dotenv");
dotenv.config();

module.exports={
    DATABASE_USERNAME : process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD : process.env.DATABASE_PASSWORD,
    PORT : process.env.PORT || 3000
}
