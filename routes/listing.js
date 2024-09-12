const express =require("express")
const router = express.Router();//function used to create a new router object that can handle routes and middleware separately from the main application.
const wrapAsync=require("../utils/wrapAsync.js") //handel async error
const Listing =require("../models/listing.js");
const {IsLoggedIn, isOwner, validateListing}=require("../middleware.js");





// ---------------------------------------------------------
//index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListing =await Listing.find({}); //we are getting all data and sending it in allListing 
    res.render("listings/index.ejs", {allListing});
}));

//new route
router.get("/new",IsLoggedIn,(req,res)=>{ //we have passed IsLoggedIn middleware to check user is logged in to create new listing
 
    res.render("listings/new.ejs");
})


//show route
router.get("/:id",wrapAsync(async (req,res)=>{ //when we click on title then it will lead to spesific id
    let {id}= req.params;
   const listing=await Listing.findById(id).populate("reviews").populate("owner");// .populate("reviews") ensures that instead of just storing the ObjectIds,
                                                                // it fetches the full review data associated with each ObjectId.
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings")
    }
   res.render("listings/show.ejs", {listing});
}));


//create route
router.post("/",IsLoggedIn, validateListing, wrapAsync(async (req,res,next) =>{
    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    await newlisting.save();
    req.flash("success","New Listing Created!")
    res.redirect("/listings");

})
);

//edit route
router.get("/:id/edit",IsLoggedIn,isOwner,wrapAsync(async(req,res)=>{
let {id}= req.params;
const listing=await Listing.findById(id);
if(!listing){
    req.flash("error","Listing you requested for does not exist!")
    res.redirect("/listings")
}
res.render("listings/edit.ejs",{listing})
}));

//update route
router.put("/:id",IsLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
let {id}= req.params;
await  Listing.findByIdAndUpdate(id,{...req.body.listing})
req.flash("success","Listing Updated!")
res.redirect(`/listings/${id}`)
}));

//delete route
router.delete("/:id",IsLoggedIn,isOwner,wrapAsync(async(req,res)=>{
let {id}= req.params;
let deleteListing =await Listing.findByIdAndDelete(id)
req.flash("success","Listing Deleted!")
res.redirect("/listings")

}));

module.exports =router;