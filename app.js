//jshint esversion:6
require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
//const encrypt=require("mongoose-encryption");//mongoose encryption used to encrypt
//const md5=require("md5");//md5 used for hashing only
const bcrypt=require("bcrypt");
const saltRounds=10;

console.log(process.env.API_KEY);
const app=express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


//mongoose connection to mongodb
mongoose.set('strictQuery', true);
//mongoose.connect('mongodb+srv://RakeshM:Rakesh28@cluster0.7g3jwns.mongodb.net/todolistDB',{useNewUrlParser:true});
//mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});
mongoose.connect('mongodb://127.0.0.1/userDB');

//schema for model/collection/table created
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

// const secret=process.env.SECRET;
// userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const User=new mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/logout",function(req,res){
    res.redirect("/");
});

app.post("/login",function(req,res){
   const email=req.body.username;
   const password=req.body.password;
    User.findOne({email:email},function(err,foundedUser){
        if(err){
            console.log(err);}
        else{
            if(foundedUser){
                bcrypt.compare(password ,foundedUser.password,function(err,result){
                 if(result===true){
                     res.render("secrets");
                 }
                 });
             }  
        }
    });
});
// this is register part
app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const registeredPassword=req.body.password ;
    bcrypt.hash(registeredPassword, saltRounds ,function(err,hash){
        const newUser = new User({
            email:req.body.username,
            password:hash
         });
         
      newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
         //console.log(md5("123456"));
            res.render("secrets")
        }
     })
    });
   
});
app.get("/submit",function(req,res){
    res.render("submit");
});





let port=process.env.PORT;
app.listen(port || 3000,function(req,res){
    console.log("port is 3000")
});
//app.route("/articles")
// .get(function(req,res){
//     Article.find(function(err,foundedArticle){
//        if(!err){
//         res.send(foundedArticle);
//        }
//        else{
//         res.send(err);
//        }
//     })
// })
// .post(function(req,res){ 
//     const newArticle=new Article({
//         title:req.body.title,
//         content:req.body.content    
//     });
//     newArticle.save(function(err){
//         if(!err){
//             res.send("successfully saved")
//         }
//         else{
//             console.log(err);
//         }
//     }) 

// })
// .delete(function(req,res){
//     Article.deleteMany(function(err){
//      if(!err){
//         res.send("successfully deleted");
//      }
//      else{
//         res.send(err);
//      }
//     })
// });

 


