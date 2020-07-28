// mongoose 쓰니까 promise 나오므로 대신 async 씀 -> 원래 문서에 있는 callback 안 써도 됨
// line 14 부분 괄호 잘못 썼다가 고생함
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        const newUser = {
          // save google profile data
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };
        try {
          // 만약 그 user가 있으면 그 user 정보 쓰고, 없으면 새로운 user를 만든다
          // 얘는 저번에 app처럼 이미 가입됐으면 오류뜨게 하는 것과는 전혀 다르다
          // 왜냐하면 가입은 이미 구글에서 된 상태고, 여기서 하는 것은 어떻게든
          // 서버로 통과를 시켜주기만 하면 되는 것이고, 이 과정에서 이미 데이터에
          // 있는 애면 그냥 통과시키면 되고 없는 애면 새로 만들면 되는 것
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
