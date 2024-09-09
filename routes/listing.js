const express =require("express")
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js") //handel async error
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema, reviewSchema} =require("../schema.js"); //schema validation using Joi
const Listing =require("../models/listing.js");



//check schema of listing from incoming req.body
const validateListing =(req,res,next)=>{ 
    let {error}= listingSchema.validate(req.body)  // This ensures the incoming data matches the schema's structure and rules.
    if(error){
        let errMsg =error.details.map((ele)=>ele.message).join(",");
     throw new ExpressError(400,errMsg);

    }else{
        next();
    }
}


// ---------------------------------------------------------
//index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListing =await Listing.find({}); //we are getting all data and sending it in allListing 
    res.render("listings/index.ejs", {allListing});
}));

//new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})


//show route
router.get("/:id",wrapAsync(async (req,res)=>{ //when we click on title then it will lead to spesific id
    let {id}= req.params;
   const listing=await Listing.findById(id).populate("reviews");// .populate("reviews") ensures that instead of just storing the ObjectIds,
                                                                // it fetches the full review data associated with each ObjectId.
   res.render("listings/show.ejs", {listing});
}));


//create route
router.post("/", validateListing, wrapAsync(async (req,res,next) =>{
   
       
    const newlisting=new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");

})
);

//edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
let {id}= req.params;
const listing=await Listing.findById(id);
res.render("listings/edit.ejs",{listing})
}));

//update route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
let {id}= req.params;
await  Listing.findByIdAndUpdate(id,{...req.body.listing})
res.redirect(`/listings/${id}`)
}));

//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
let {id}= req.params;
let deleteListing =await Listing.findByIdAndDelete(id)
res.redirect("/listings")

}));

module.exports =router;