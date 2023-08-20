require('dotenv').config();
const express=require("express");
const app=express();
const hbs=require("hbs");
const bcrypt=require("bcryptjs");
require("./db/conn");
const path = require("path");
const port= process.env.PORT || 5000 ;
const static_path=path.join(__dirname,"../public");
const views_path=path.join(__dirname,"../templetes/views");
const partial_path=path.join(__dirname,"../templetes/partials");
const register=require("./models/register");
//for using the auth 
const auth=require("./middleware/auth");
//for getting the cookie
const cookieParser=require("cookie-parser")
app.use(express.json());
app.use(express.urlencoded({extended : false}));
//for using the ciikieparser
app.use(cookieParser());
console.log(static_path); 
console.log(views_path);
console.log(partial_path);
hbs.registerPartials(partial_path);
app.use(express.static(static_path)); 
app.set("view engine","hbs");
app.set("views",views_path);
console.log(process.env.SECRET);
app.get("/",(req,res)=>{
    res.render("index") ;
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.get("/about",auth,(req,res)=>{
    console.log(`this iss the  cookie ${req.cookies.jwt}`);
    res.render("about");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/logout",auth,async(req,res)=>{ 
    try{
        //let suppose we are logged in in various device and we want to log out from this particular device
        req.user.tokens=req.user.tokens.filter((currentElement)=>{
            return currentElement.token !== req.token;
        })
        //  //to clear the cookie
         res.clearCookie("jwt");
         //to save the cookie
         req.user.save(); 
        console.log("logout successfully");
    res.render("login");
    }catch(error)
    {
        res.status(400).send(error);
    }
})
app.post("/register",async (req, res) => {
    try {
        // console.log(req.body.first); // Correct placement of the console.log
        // console.log("dhb");
        // // res.send(req.body.first);
        // console.log(req.body.last);
        // console.log(req.body.email);
        // res.send(res.body.address1);
        const studentdetasil= new register({//studentdetail is a instance and register is a collection
            first:req.body.first,
            last :req.body.last,
            email: req.body.email,
            address1:req.body.address1,
            address2:req.body.address2,
            city: req.body.city,
            password: req.body.password,
        })
        //here middle ware works
        //middleware of grnerate tokens
        const token= await studentdetasil.generateToken();
        console.log(token);
        //bcrypt of password for this we add a pre funtion after schema in register which will work just before save is ccalled
        //now we want to add our token to cookies
        // the res.cookie() function is used to set the cookie name to value
        // the value parameter may be a string or object converted to json
        // syntsx:
        // res.cookie(name,value,[options]);
        res.cookie("jwt",token,{
            expires : new Date(Date.now()+500000),
            // httpOnly:true,
        }
        );
        // console.log("re");
        // Assuming you're using Express.js
// console.log(req.cookie.jwt); // This will log the value of the 'jwt' cookie

        const registered= await studentdetasil.save();
        res.status(201).render("index");
    } catch (error) { 
        res.status(400).send(error);
    }
    });
    app.post("/login",async(req,res)=>{
    try{
        const email=req.body.email;
        const pass=req.body.password;
        console.log("hcg");
        console.log(email);
        console.log(pass);
        const useremail=await register.findOne({email:email});
        // console.log(useremail);
        // if(useremail.password === pass)
        // {
        //  res.status(201).render("index");
        // }
     
        //now we need to get the cookies to check at the time of login f a user
        console.log(useremail);
        const token= await useremail.generateToken();//here the instance is useremail 
        console.log(`the token is ${token}`);
        res.cookie("jwt",token,{
            expires : new Date(Date.now()+50000 ),
            httpOnly:true,
        }
        ); 
        const temp=await bcrypt.hash(pass,10);
        console.log(`the given password is ${temp}`);
        const ismatch= await bcrypt.compare(pass,useremail.password);
        console.log(ismatch);
        if(ismatch)
        {
            console.log("*******match******");
            res.status(201).render("index");
        }     
        else{ 
         res.send("invalid login details man"); 
        }
    }catch(e){
        res.status(400).send(e );
    }
})
app.listen(port, ()=>{
    console.log("listening ");
})
