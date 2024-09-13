const express =require("express")
const router = express.Router();//function used to create a new router object that can handle routes and middleware separately from the main application.
const User= require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js"); //handel async error
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js")


//renderSignup
router.get("/signup",userController.renderSignUpForm);

//signup 
router.post("/signup",wrapAsync(userController.signUp));

//renderLoginForm 
router.get("/login",userController.renderLoginForm);

// login 
router.post(
    "/login",saveRedirectUrl,
                        //"local": Indicates you're using the local authentication strategy (username & password).
    passport.authenticate( "local", {failureRedirect:'/login' ,failureFlash:true} ),
    userController.login)


//logout 
router.get("/logout",userController.logout)

module.exports =router;