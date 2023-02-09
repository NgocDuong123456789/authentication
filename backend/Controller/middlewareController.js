const jwt=require('jsonwebtoken')
const middleware={
    //verifyToken
    verifyToken: (req,res,next)=>{

        const token= req.headers.token;
        if(token){
            const accessToken=token.split(' ')[1] // lấy được token
            // chứng nhận có phải token
            jwt.verify(accessToken,process.env.JWT_ACCESS_KEY,(error,user)=>{
                if(error){// lỗi là không phải bạn hoặc token đã hết hạn
                 return    res.status(403).json('token is not valid')
                } 
                req.user= user;
                next()

            })

        }else{
          return   res.status(401).json('you are not authentication')

        }
    },

    verifyTokenAdminAuth: function(req, res, next){
        middleware.verifyToken(req, res, ()=>{
            if(req.user.id=== req.params.id || req.user.admin){
                next()
            }else{
              return  res.status(404).json('you are not delete user')
            }
        })    
    },
   
}

module.exports= middleware