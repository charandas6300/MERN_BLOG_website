const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User')
var bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken')

//encrypted 
const salt = bcrypt.genSaltSync(10);
const secret = 'dqewr273edwgcer6879r23ude9t723';

app.use(cors({credentials:true, origin:'http://localhost:3000'}))
app.use(express.json())

//mongo connection
mongoose.connect('mongodb+srv://vankadothcharandas:asdfghjkl@cluster0.uxorr5q.mongodb.net/?retryWrites=true&w=majority')

// app.get('/',(req,res)=>{
//     res.send("SERVER")
// })

//registering of the user
app.post('/register',async(req,res)=>{
    const {username,password} = req.body;
    try{
    const userDoc = await User.create(
        {username,password:bcrypt.hashSync(password,salt),
        });
    res.json(userDoc);
    }
    catch(e){
        res.status(404).json(e)
        // res.send(e)
    }
});

//to login
app.post('/login',async(req,res)=>{
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    //correct detail when login
    if(passOk){
        //logged in
        jwt.sign({username, id:userDoc._id},secret, {}, (err, token)=>{
            if(err) throw err;
            res.cookie('token',token).json('ok')
        })

    }
    else{
        res.status(400).json("wrong credentials")
    }
})

app.listen(4000)
