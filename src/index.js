const express = require("express");
const bodyParser = require('body-parser');
const APIroutes = require("./router/index");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(APIroutes);

app.get('/hi',(req,res)=>{
    res.status(200).json({
        msg:"hello",
    });
})
app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`);
});

