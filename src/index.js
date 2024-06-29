const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors'); 
const APIroutes = require("./router/index");
const { AppDataSource } = require("./config/database-config");
require("reflect-metadata");
const {PORT} = require("./config/server-config");

const app = express();

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(APIroutes);

app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);
    await AppDataSource.initialize();
    console.log("Database Connected!");
});
