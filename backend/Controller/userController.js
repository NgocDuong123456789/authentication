const { findById } = require("../Models/User");
const User = require("../Models/User");
const userController={
    getAllUsers: async(req, res,next)=>{
        try{

            const user= await User.find()
         return    res.status(200).json(user)
            
        }
        catch(error){
          return   res.status(500).json(error)
        }
    },
    // delete user from all
    deleteUser:async(req, res, next)=>{
        try{

            const user= await User.findById(req.params.id)
            if(user){
              return   res.status(200).json('delete success')
            }
        }
        catch(error){
          return   res.status(5000).json(error)
           

        }

    }
};

module.exports = userController