// cross-env로 모든 플랫폼서 사용가능하게 함 / node env 설정해야 빨라짐 / 밑에 사이트는 env 설명
// https://dev.to/getd/how-to-manage-secrets-and-configs-using-dotenv-in-node-js-and-docker-2214#:~:text=dotenv%20allows%20you%20to%20separate,env%20file.
// cdn js라는 사이트에서 모든 사이트 url 다운 가능
// css 파일만 static으로 만들어서 hbs들에 적용시켜줌, 이미 static 처리된 폴더에 속해있는 거라서 경로는 css부터만 써주면 됨
// 여기서는 특이하게 main 파일을 두 개 만들어서 layouts에 넣음
// google cloud platform에서 api 등록하고 다 가능
const express = require("express");
const dotenv = require("dotenv");
const exphbs = require("express-handlebars");
const path = require("path");
const morgan = require("morgan");
// 얘는 그냥 log를 기록해주는 역할, 있으면 유용, request 같은 거 console에 다 보여줌
const connectDB = require("./config/db");
// Load config - 이 소스에다 env들 저장
dotenv.config({ path: "./config/config.env" });

connectDB();
const app = express();

// development 모드에서만 morgan 쓰게
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// handlebars - 사이트서 복사, defaultlayout 설정
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// static folder
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 3000;
// routes
app.use("/", require("./routes/index"));
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  //   Package에서 설정한 두 모드 중 하나 보여줌
);
