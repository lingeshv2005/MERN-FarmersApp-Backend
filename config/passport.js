import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: "./config/config.env" });

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });

            if(!user){
                user = await User({
                    userId: uuidv1(),
                    googleId: profile.id,
                    userName: profile.displayName,
                    email: profile.emails[0].value,
                    profilePic: profile.photos[0].value
                });
                await user.save();
            }

            const token = jwt.sign({ userId: user.userId }, process.env.secretKey, { expiresIn:"1h" });
            
            return done(null, {user, token});
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((data, done) =>{
    done(null, data);
});

passport.deserializeUser((data, done)=>{
    done(null, data);
});