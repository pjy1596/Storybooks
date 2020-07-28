const express = require("express");
const router = express.Router();
const passport = require("passport");

// router.get("/", (req, res) => {
//   // login이라는 이름의 template 찾는다
//   //   그리고 layout도 login 파일로 설정
//   res.render("login", {
//     layout: "login",
//   });
// });

// @desc auth with google
// @route get/ auth / google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc google auth callback
// @route get/ auth / google / callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    // Successful authentication, redirect dashboard.
    res.redirect("/dashboard");
  }
);

// logout -> auth/logout
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});
module.exports = router;
