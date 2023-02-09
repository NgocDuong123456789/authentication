const router= require('express').Router()
const middleware= require('../Controller/middlewareController')
const userController=require('../Controller/userController')
// get all users

router.get('/',middleware.verifyToken,userController.getAllUsers)
// delete user
router.delete("/:id",middleware.verifyTokenAdminAuth,userController.deleteUser )
module.exports = router
