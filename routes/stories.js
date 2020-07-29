const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/Story");
// @desc show add page
// @route get/ stories / add
router.get("/add", ensureAuth, (req, res) => {
  // login이라는 이름의 template 찾는다
  //   그리고 layout도 login 파일로 설정
  // guest만 보게
  res.render("stories/add");
});
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});
// all stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    // status public인 애들 다 찾기
    // lean으로 template에 pass in / descending order로 정렬 / user의 정보 같은 거
    // 얻고 싶은 데 그런 것들은 story가 아닌 User model에 있기 때문에 populate 써야됨
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});
// show single story
// get / stproes / :id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();
    if (!story) {
      return res.render("error/404");
    }
    res.render("stories/show", {
      story,
    });
  } catch (err) {
    console.error(err);
    res.render("error/404");
  }
});
// show edit page
// get / stories / edit / :id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();
    if (!story) {
      return res.render("error/404");
    }
    // 만약 스토리쓴 사람이랑 지금 로그인 된 사람이랑 다르면
    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", {
        story,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});
// update story
// put stories :id
// https://mongoosejs.com/docs/tutorials/findoneandupdate.html
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();
    if (!story) {
      return res.render("error/404");
    }
    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      res.redirect("/dashboard");
    }
  } catch (error) {
    console.error(err);
    return res.render("error/500");
  }
});
// delete story
// delete stories / :id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});
// user stories
// get / stories /user / :userid
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      // 그 유저한테 속하는 story만 보여줌
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();
    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});
module.exports = router;
