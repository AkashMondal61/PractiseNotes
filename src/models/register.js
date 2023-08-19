const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const student=new mongoose.Schema({
    first:{
        type:String ,
        required:true
    },
    last :{
        type:String ,
        required:true  
    },
    email:{
        type:String ,
        required:true  ,
        unique:true
    },
    address1:{
        type:String ,
        // required:true  
    },
    address2:{
        type:String  
    },
    city:{
            type:String ,
            // required:true  
    },
    password:{
        type:String ,
        required:true  
    },
    tokens:[{
          token:{
            type:String ,
            required:true  
          }
    }]
})
//middleware to generate tokens
student.methods.generateToken=async function(){
try{
    console.log(this._id);
const token=jwt.sign({_id:this._id.toString()},process.env.SECRET);
this.tokens=this.tokens.concat({token:token});//adding the token to data
// await this.save();//savinf the token
// console.log(this.tokens);
// console.log(token);
return token;
}catch(e){
console.log(`error found ${e}`);
}
}
//middleware to bcrypt the password
student.pre("save",async function(next){ 
    console.log(`old password iii is ${this.password}`);
    const passwod=await bcrypt.hash(this.password,10);
    console.log(`new password is ${passwod}`);
    this.password=passwod;
    next();//it is used to  run the next line
})
//creat a collection
const register=new mongoose.model("register",student);// r should be capital in register
module.exports=register; 