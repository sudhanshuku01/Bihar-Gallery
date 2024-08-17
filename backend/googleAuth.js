// googleAuth.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import User from "./model/UserModel.js";

const clientid = process.env.GOOGLE_CLIENTID;
const clientsecret = process.env.GOOGLE_CLIENTSECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: clientid,
      clientSecret: clientsecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async ( profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const setupGoogleAuthRoutes = (app) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "http://localhost:5173/profile",
      failureRedirect: "http://localhost:5173/login",
    })
  );

  app.get("/api/auth/google/login/success", async (req, res) => {
    if (req.user) {
      res.status(200).json({ message: "User Login", user: req.user });
    } else {
      res.status(400).json({ message: "Not Authorized" });
    }
  });

  app.get("/api/auth/google/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("http://localhost:5173");
    });
  });
};

export default setupGoogleAuthRoutes;
