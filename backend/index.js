const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv"); // dùng để lấy dữ liệu từ file .env
const authRouter = require("./Routes/auth");
const userRouter = require("./Routes/user");
dotenv.config(); // gọi ra để lấy data từ .env

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const port = 8000;
const app = express();

mongoose
  .connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`successfully connected`);
  })
  .catch((e) => {
    console.log(`not connected`);
  });

  //  app.use(cors());
//  app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));
app.use(cookieParser()); //để tạo cookie và gắn cookie
app.use(express.json()); // server nhận dữ liệu dưới dạng json cũng như response trả về dưới dạng json c

//Route

app.use("/auth", authRouter);
app.use('/user', userRouter);
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

// tạo authentication : dùng để so sánh tài khoản bạn nhập vào form với tài khoản trên database
// authorization: bạn là ai , bạn có thể làm gì
// jwt dùng để xác thực người dùng