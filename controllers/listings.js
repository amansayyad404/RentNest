const Listing = require("../models/listing");


//index route
module.exports.index = async (req,res)=>{
    const allListing =await Listing.find({}); //we are getting all data and sending it in allListing 
    res.render("listings/index.ejs", {allListing});
}

//new route
module.exports.renderNewForm = (req,res)=>{ //we have passed IsLoggedIn middleware to check user is logged in to create new listing
 
    res.render("listings/new.ejs");
}

//show route
module.exports.showListing = async (req,res)=>{ 
    let {id}= req.params;
   const listing=await Listing.findById(id).populate({path:"reviews",populate:{path: "author"}}).populate("owner");
                                                                
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings")
    }
   res.render("listings/show.ejs", {listing});
}

//create route
module.exports.createListing = async (req,res,next) =>{
    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    await newlisting.save();
    req.flash("success","New Listing Created!")
    res.redirect("/listings");

}

//edit route
module.exports.renderEditForm =async(req,res)=>{
    let {id}= req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing})
    }

//update route
module.exports.updateListing =async(req,res)=>{
    let {id}= req.params;
    await  Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`)
    }

//delete route
module.exports.destroyListing =async(req,res)=>{
    let {id}= req.params;
    let deleteListing =await Listing.findByIdAndDelete(id)
    req.flash("success","Listing Deleted!")
    res.redirect("/listings")
    
    }