const jwt=require("jsonwebtoken");//to verify the tokens
const register=require("../models/register");
const auth=async(req,res,next)=>{
    try{
          const token=req.cookies.jwt;//it the token given by the user
          const verifyuser=jwt.verify(token,process.env.SECRET);
         const user=await register.findOne({_id:verifyuser._id});
         console.log(user.first);
         req.token=token;
         req.user  =user;
          next();
    }catch(error)
    {
        res.status(401).send(error);
    }
}
module.exports=auth;