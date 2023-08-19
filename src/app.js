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
app.use(express.json());
app.use(express.urlencoded({extended : false}));
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
app.get("/login",(req,res)=>{
    res.render("login");
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
        //bcrypt of password for this we add a pre funtion after schema in register which will work just before save is ccalled
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
        const token= await useremail.generateToken();//here the instance is useremail 
        console.log(`the token is ${token}`)
        const temp=await bcrypt.hash(pass,10);
        console.log(temp);
        const ismatch= await bcrypt.compare(pass,useremail.password);
        console.log(ismatch);
        if(ismatch)
        {
            console.log("match*********************");
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
