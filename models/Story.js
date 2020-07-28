const mongoose = require("mongoose");
const StorySchema = new mongoose.Schema({
  // googleID는 oauth쓸 때만 쓰는 특수한 것 / 이 밑에 6개 말고는 추가하거나 이름 바꿔도 항상 같은 정보 옴. 구글은 미리 양식이 정해짐
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "public",
    enum: ["public", "private"],
  },
  //   user 누가 뭐 했는지 알기 위해
  // ref field means in which collection the id mentioned is going to be searched for. –
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Story", StorySchema);
