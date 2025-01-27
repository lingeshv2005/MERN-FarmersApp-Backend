
const userDetailsSchema=new mongoose.Schema({
    userId: {type:String, unique:true, required:true},
    email: {type: String, unique: true ,default:"",required: true},
    username: {type: String, required: true, unique: true },
    phone: {type: String, unique: true ,default:"", required:true},
});
const User=new mongoose.model("userDetails",userSchema);

const userDetailsUpdate=()=>{
    
}