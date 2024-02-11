const express =  require("express");
const adminRouter = express.Router()
const { addAdmin,signinAdmin,getAllAdmins,getAdminById} = require("../controllers/adminController");

adminRouter.post('/signup',addAdmin)
adminRouter.post('/signin',signinAdmin)
adminRouter.get('/getalladmins',getAllAdmins)
adminRouter.get('/',getAllAdmins)
adminRouter.get('/:id',getAdminById)


module.exports = adminRouter 