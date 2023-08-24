import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import config from "config";
import User from "@src/data/user";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: String(config.get("auth.secret")),
};

export default {
  passport: passport.use(
    new JwtStrategy(options, async function (jwtPayload, done) {
      const user = await User.getViaEmail(jwtPayload.email);

      if (user) {
        return done(null, user);
      }
      return done(null, false);
    })
  ),
};
