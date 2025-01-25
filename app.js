const express=require("express");
const mongoose=require("mongoose");

const app=express();
app.use(express.json());
const port=3000;

const mongourl="";
mongoose.connect(mongourl)
    .then(() => {
        console.log("MongoDB Connected...");
        app.listen(port,()=>{
            console.log(`Server is running on port ${port}`);
        });
    });

const schema=new mongoose.Schema({});
const model=new mongoose.model("login",schema);

app.post("/api/login",async (req,res)=>{
    const {username,password}=req.body;
    const user=await model.findOne({username});
    if(!user){
        return res.status(404).json({message:"User not found"});
    }

})
    
