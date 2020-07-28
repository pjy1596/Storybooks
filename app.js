// cross-env로 모든 플랫폼서 사용가능하게 함 / node env 설정해야 빨라짐 / 밑에 사이트는 env 설명
// https://dev.to/getd/how-to-manage-secrets-and-configs-using-dotenv-in-node-js-and-docker-2214#:~:text=dotenv%20allows%20you%20to%20separate,env%20file.
// cdn js라는 사이트에서 모든 사이트 url 다운 가능
// css 파일만 static으로 만들어서 hbs들에 적용시켜줌, 이미 static 처리된 폴더에 속해있는 거라서 경로는 css부터만 써주면 됨
// 여기서는 특이하게 main 파일을 두 개 만들어서 layouts에 넣음
// google cloud platform에서 api 등록하고 다 가능, OAUTH에서 다 만들고 clientid랑 clientsecret env에 저장
// passport google oauth20 씀
// localhost:3000/dashboard -dashboard 화면, dashboard template 이용
// localhost:3000/ -맨 처음 login 화면, login template 이용
// 밑에 두 개는 구글 auth 필수 내용. auth 성공시 dashboard로 감
// localhost:3000/auth/google/callback
// localhost:3000/auth/google
// https://github.com/jaredhanson/passport-google-oauth2 google oauth 참고
// https://materializecss.com/sidenav.html materialize는 쓰려면 init 해줘야 됨. 문서 참고
// 변경사항 여기서 저장하고 storybook 페이지 새로 고침하면 그 자리에 머무르는 게 아니라 다시 login 화면으로 kick 해 버림
// 이를 막기 위해 세션에 정보 저장
// ck editor로 add에 있는 textarea 대체하기. cdn + script
// req.body를 post에서 쓰려면 bodyparser 필요
const express = require("express");
const dotenv = require("dotenv");
const exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const morgan = require("morgan");
// 얘는 그냥 log를 기록해주는 역할, 있으면 유용, request 같은 거 console에 다 보여줌
const connectDB = require("./config/db");
// Load config - 이 소스에다 env들 저장
dotenv.config({ path: "./config/config.env" });
// passport config
require("./config/passport")(passport);
connectDB();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// development 모드에서만 morgan 쓰게
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// handlebars - 사이트서 복사, defaultlayout 설정
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");
// sessions
app.use(
  session({
    secret: "gogo",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
// passport middleware
app.use(passport.initialize());
app.use(passport.session());
// static folder
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 3000;
// routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("stories", require("./routes/stories"));

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  //   Package에서 설정한 두 모드 중 하나 보여줌
);
