require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect(
'mongodb://localhost:27017/userDB'
, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})

// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']})

const User = mongoose.model('User',userSchema)

app.get('/',function(req,res){
    res.render('home')
})
app.get('/login',function(req,res){
    res.render('login')
})
app.get('/register',function(req,res){
    res.render('register')
})

app.post('/register',function(req,res){
    
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newU = new User({
            email:req.body.username,
            password:hash
        })
        // console.log(req.body.email)
        newU.save(function(err){
            if(err){
                console.log(err)
            }else{
                res.render('secrets')
            }
        })
    });
    
})

app.post('/login',function(req,res){
    const uEmail = req.body.username
    const uPass = req.body.password
    User.findOne({email:uEmail},function(err,result){
        // console.log(result)
        if(err){
            console.log(err)
        }else{
            bcrypt.compare(uPass, result.password, function(err, resul) {
                // result == true
                if(resul){
                    res.render('secrets')
                }
            });
          
        }
    })
})


app.listen(3000, () => {
    console.log(`Server started on port`);
});
