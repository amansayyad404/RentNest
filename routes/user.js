const express =require("express")
const router = express.Router();//function used to create a new router object that can handle routes and middleware separately from the main application.
const User= require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js"); //handel async error
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try {
    let {username,email,password} =req.body;
     const newUser=new User({email,username});
     const registeredUser = await User.register(newUser,password); // Use passport-local-mongoose's 'register' method to register the user
                                                                     // This automatically hashes the password and saves the user in the database
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to RentNest!")
            res.redirect("/listings");
    })

    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup")
    }
     

}));

router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
});

router.post(
    "/login",saveRedirectUrl,
                        //"local": Indicates you're using the local authentication strategy (username & password).
    passport.authenticate( "local", {failureRedirect:'/login' ,failureFlash:true} ),
    async(req,res)=>{
        req.flash("success","welcome back");
        console.log(req.user);
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
})

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
         return   next(err);
        }
        req.flash("success","you are logged out!")
        res.redirect("/listings");
    })
})

module.exports =router;