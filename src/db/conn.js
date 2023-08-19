const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/practise",{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,
})
.then(()=>{
    console.log("connection success"); 
}).catch((e)=>{
console.log(e);
})
