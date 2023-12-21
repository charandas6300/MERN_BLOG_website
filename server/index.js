const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors())

app.get('/',(req,res)=>{
    res.send("SERVER")
})

app.post('/register',(req,res)=>{
    res.json("regISTER")
    console.log("ywess")
});

app.listen(4000)