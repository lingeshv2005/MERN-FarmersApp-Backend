import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";
import Razorpay from 'razorpay';
dotenv.config({ path: "./config/config.env" });

dotenv.config();
connectDB();

export const instance=new Razorpay({
    key_id: process.env.razorpay_api_key,
    key_secret: process.env.razorpay_api_secret
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
