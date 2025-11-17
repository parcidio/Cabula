import passport, { session } from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy, } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { NotFoundException } from "../utils/appError";
import { ProviderEnum } from "../enums/account-provider.enum";
import { findUserByIdService, loginOrCreateAccountService, verifyUserService } from "../services/auth.service";
import { Verify } from "crypto";
import { signJwtToken } from "../utils/jwt";

import {Strategy as jwtStrategy, ExtractJwt,StrategyOptions} from "passport-jwt"
import { config } from "./app.config";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL ,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req: Request, accessToken, refreshToken, profile, done) => {
      try{
        const {email, sub: googleId, picture} = profile._json;

        console.log("Google profile:", profile);
        console.log("Google ID:", googleId);

        if(!googleId){
          throw new NotFoundException("Google ID (sub) is missing.");
        }

        // Login or create a new account
        const {user} = await loginOrCreateAccountService({
            provider: ProviderEnum.GOOGLE,
            displayName: profile.displayName,
            providerId: googleId,
            picture: picture,
            email: email ,
        });

        const jwt = signJwtToken({userId: user._id});
        req.jwt = jwt;
         done(null, user);

      }catch (error) {
        console.error("Error in Google strategy callback:", error);
         done(error, false);
      }
    }
  )
);


passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await verifyUserService({ email, password });
        return done(null, user);
      } catch (error: any) {
        return done(error, false, { message: error?.message });
      }
    }
  )
);

interface JwtPayload {
  userId: string;
}

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
  audience: ["user"],
  algorithms: ["HS256"],  
};

passport.use(
  new jwtStrategy(options, async (payload: JwtPayload, done) =>{
    try{
      const user = await findUserByIdService(payload.userId);
      if(!user){
        return done(null, false);
      }
      return done(null, user);
    }catch(error){
      return done(error, false);
    }
  }
)
)

passport.serializeUser((user:any, done) => done(null, user));

passport.deserializeUser(async (user:any, done) => done(null, user));

//Middleware to authenticate requests using JWT strategy
export const passportAuthenticateJWT = passport.authenticate("jwt", {session: false})
