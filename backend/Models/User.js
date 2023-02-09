const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const Users = new Schema(
  {
    username: {
      type: String,
      required: true, // bắt buộc phải có
      //   minlength: 6,
      //   maxlength: 20,
      // unique: true, // chỉ có duy nhất
    },
    email: {
      type: String,
      required: true, //
      // unique: true,
    },
    password: {
      type: String,
      required: true, //
      //   minlength: 1,
    },
    admin: {
      type: Boolean,
      default: false, //bắt đầu ai đk hay đăng nhập vào bạn dầu đều là false tức là không phải admin
    },
  },
  {
    collection: "auth",
  }
  // {
  //   timestamps: true, //user được tạo và update khi nào
  // }
);

module.exports = mongoose.model("auth", Users);
