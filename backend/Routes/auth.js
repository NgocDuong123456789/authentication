const authController = require("../Controller/authController");
const route = require("express").Router();
const middlewareController= require("../Controller/middlewareController")
route.post("/register", authController.registerUser);
route.post("/login", authController.loginUser);
// refresh
route.post('/refresh', authController.requestRefreshToken)
//logout
route.post('/logout',middlewareController.verifyToken,authController.userLogout)
module.exports = route;
