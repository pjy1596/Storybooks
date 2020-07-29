const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Story = require("../models/Story");
// @desc login/landing page
// @route get/
router.get("/", ensureGuest, (req, res) => {
  // login이라는 이름의 template 찾는다
  //   그리고 layout도 login 파일로 설정
  // guest만 보게
  res.render("login", {
    layout: "login",
  });
});
// @desc dashboard
// @route get/ dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    // id가 match하는 user만 찾는다(로그인 된 애만 찾음 - user가 req.user.id인 애들 다 찾기)
    // lean은 handlebar에서 template에 passin 해서 사용하게 해주는 방법임
    // code를 보자면 일단 찾고난 다음에 자바스크립트로 결과 보여줌
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      // 보면 알겠지만 render는 get하고 쓰는 방식 다르고 바로 쓰면 됨
      // 저번 앱처럼 name passin
      name: req.user.firstName,
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
  // dashboard라는 이름의 template 찾는다
});

module.exports = router;
