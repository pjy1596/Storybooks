// try and catch / catch는 try에서 에러가 생기면 그걸 보여주는 역할을 함
// process.exit 그냥 node js에서 exit하는 방법. 1은 exit with a failure code / 0은 success code
// mongo db는 promise를 만들어내는데(fetch랑 async를 써도 promise가 생기게 함), 애는 그냥 then 쓰기 싫다고 async 씀. 원하는 거 쓰면 됨.
// 다른 파일에서는 app.js에다가 then 쓴 버전도 있음
// async 쓰니까 당연히 await도 쓰는 건데 까먹음
const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.Mongo_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`MONGODB connected : ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
module.exports = connectDB;
