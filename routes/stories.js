const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/Story");
// @desc show add page
// @route get/ stories / add
router.get("/", ensureAuth, (req, res) => {
  // login이라는 이름의 template 찾는다
  //   그리고 layout도 login 파일로 설정
  // guest만 보게
  res.render("stories/add");
});

module.exports = router;
