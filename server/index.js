const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
var bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
//
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: './uploads'});
const fs = require('fs')//file system(to add eextension .jpg,.webp,etc ..)

//encrypted 
const salt = bcrypt.genSaltSync(10);
const secret = 'dqewr273edwgcer6879r23ude9t723';

//middlewares
app.use(cors({credentials:true, origin:'http://localhost:3000'}))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'));
// api.use(bodyParser.urlencoded({ extended: true }));

//mongo connection
mongoose.connect('mongodb+srv://vankadothcharandas:asdfghjkl@cluster0.uxorr5q.mongodb.net/?retryWrites=true&w=majority')



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
            res.cookie('token',token).json({
              id:userDoc._id,  
              username,
            })
        })

    }
    else{
        res.status(400).json("wrong credentials")
    }
})

app.get('/profile',(req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token,secret,{},(err,info)=>{
        if(err) throw err;
        res.json(info);
    })
})


app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
})

//To post(multer is used)
app.post('/post',uploadMiddleware.single('file'), async(req,res)=>{//in createPost data.set is named to file so we use "file"
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token,secret,{},async(err,info)=>{
        
        if(err) throw err;
        const {title, summary, content} = req.body; 

        const PostDoc = await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author:info.id,       
        })
        res.json(PostDoc);
    })
  
});


app.put('/post', uploadMiddleware.single('file'), async(req,res)=>{
    let newPath = null;
    if(req.file){
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token,secret,{},async(err,info)=>{
        
        if(err) throw err;
        const {id, title, summary, content} = req.body; 
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author)=== JSON.stringify(info.id);
        if(!isAuthor){
            return res.status(400).json('you are not the author');
        }

        const updatedPost = await Post.findByIdAndUpdate(id, {
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        }, { new: true });
        
        res.json(updatedPost);
        
    });

});


app.get('/post',async(req,res)=>{
    res.json(
        await Post.find()
        .populate('author',['username'])
        .sort({createdAt: -1})
        .limit(20)
        );
});



app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  })
  
app.listen(4000)
