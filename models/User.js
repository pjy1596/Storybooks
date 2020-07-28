const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  // googleID는 oauth쓸 때만 쓰는 특수한 것 / 이 밑에 6개 말고는 추가하거나 이름 바꿔도 항상 같은 정보 옴. 구글은 미리 양식이 정해짐
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("User", UserSchema);
