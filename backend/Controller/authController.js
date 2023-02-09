const bcrypt = require("bcrypt"); // dùng để mã hóa cái mật khẩu khi lưu vào db để bảo mật
const User = require("../Models/User");
const jwt=require("jsonwebtoken");
let refreshTokens=[]
const authController = {
  // REGISTER

  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt); // salt là kiểu để hash
      // create new user
      const newUser = await User({
        
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });
      const user = await newUser.save();
     return res.status(200).json(user);
    } catch (error) {
      console.log(error);
    return   res.status(500).json(error);
    }
  },

  // Generate access_token
  generateAccessToken: (user)=>{
   return jwt.sign({
      id:user.id,
      admin:user.admin,
    },process.env.JWT_ACCESS_KEY,{expiresIn:'30s'})
  },
  generateRefreshToken:(user)=>{
   return  jwt.sign(
      {
        id:user.id,
        admin:user.admin,
      },process.env.JWT_REFRESH_KEY,{expiresIn:'365d'}
    )
  },
  loginUser: async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
      return   res.status(404).json("wrong username");
      }

      const valiPassword = await bcrypt.compare(
        // so sánh 2 password đã bị mã hóa trả về true , false
        req.body.password,
        user.password
      );

      if (!valiPassword) {
       return  res.status(401).json("wrong password");
      }

      if (user && valiPassword) {
        const access_token=authController.generateAccessToken(user)
        const refresh_token=authController.generateRefreshToken(user)
        refreshTokens.push(refresh_token)
        res.cookie('refreshToken',refresh_token,{
          httpOnly: true,
          secure: false,
          path:"/",
          sameSite:"strict"
        })

        const{password,...others}=user._doc
    return res.status(200).json({others, access_token});
      }
    } catch (error) {
      console.log(error);
     return  res.status(500).json(error);
    }
  },

  requestRefreshToken:(req, res,next)=>{
    // lấy refresh từ user 
       const refreshToken= req.cookies.refreshToken

       if(!refreshToken) return res.status(401).json('you are not authentication')
       if(!refreshTokens.includes(refreshToken)){
        return res.status(403).json('Refresh token is not valid')
       }
       jwt.verify(refreshToken,process.env.JWT_REFRESH_KEY,(error, user)=>{
        if(error) {
          console.log(error)
        }
        refreshTokens = refreshTokens.filter(token=>token !== refreshToken)
        
          //create new accessToke and refreshToken
          const newAccessToken=authController.generateAccessToken(user);
          const newRefreshToken=authController.generateRefreshToken(user);
          refreshTokens.push(newRefreshToken);
          
          res.cookie('refreshToken', newRefreshToken,{
            httpOnly:true,secure:false,path:"/",sameSite:"strict"
          })

        return res.status(200).json({access_token:newAccessToken, refresh_token: newRefreshToken})
        
       })
     return   res.status(200).json(refreshToken)
  }  ,
  userLogout: async(req,res)=>{
    res.clearCookie('refreshToken')
    refreshTokens= refreshTokens.filter(token=> token !== req.cookies.refreshToken)
   return  res.status(200).json('logout success')
  }
};


module.exports = authController;


// store token 
// dùng localstorage
// dễ bị tấn công bởi XSS 
// COOKIES
// ít bị tấn công bởi XSS ,
// DỄ BỊ TẤN CÔNG BỞI CSRF
//-> có thể khắc phục bở samesite
// 3 dùng redux store=> accesstoken
// httponly cookies-> refreshtoken lưu trên httponly
// KHẮC PHỤC PFF PATTERN (BACKEND FOR FRONTEND)