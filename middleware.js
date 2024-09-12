module.exports.IsLoggedIn = (req,res,next)=>{

    if (!req.isAuthenticated()){ //if not logged in 

        req.flash("error","you must be logged!");
        return res.redirect("/login");
    }
    next();
}