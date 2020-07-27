const express = require("express");
const router = express.Router();

// @desc login/landing page
// @route get/
router.get("/", (req, res) => {
  // login이라는 이름의 template 찾는다
  //   그리고 layout도 login 파일로 설정
  res.render("login", {
    layout: "login",
  });
});
// @desc dashboard
// @route get/ dashboard
router.get("/dashboard", (req, res) => {
  // dashboard라는 이름의 template 찾는다
  res.render("dashboard");
});

module.exports = router;
