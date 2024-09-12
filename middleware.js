module.exports.IsLoggedIn = (req,res,next)=>{

    if (!req.isAuthenticated()){ //if not logged in 
        req.session.redirectUrl = req.originalUrl; //current page url
        req.flash("error","you must be logged!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}