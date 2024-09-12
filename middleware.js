const Listing = require("./models/listing");

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

module.exports.isOwner = async(req,res,next)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    
    if(!listing.owner._id.equals(res.locals.currentUser._id) ){ //if current user and listing owner are not same return 
        req.flash("error","You are not the owner of this listing");
       return res.redirect(`/listings/${id}`);
    
    }
    next();
}