const express =require("express")
const router = express.Router({mergeParams:true});//function used to create a new router object that can handle routes and middleware separately from the main application.
const wrapAsync=require("../utils/wrapAsync.js") //handel async error
const ExpressError=require("../utils/ExpressError.js")
const { reviewSchema} =require("../schema.js"); //schema validation using Joi
const Review =require("../models/review.js");
const Listing =require("../models/listing.js");




// This ensures the incoming data matches the schema's structure and rules.
const validateReview =(req,res,next)=>{ 
    let {error}= reviewSchema.validate(req.body)  
    if(error){
        let errMsg =error.details.map((ele)=>ele.message).join(",");
     throw new ExpressError(400,errMsg);

    }else{
        next();
    }
}


//post review route
router.post("/",validateReview, wrapAsync(async(req,res)=>{
    let listing =await Listing.findById(req.params.id);// Find the "listing" by its ID (from the URL parameter ":id")
    let newReview =new Review(req.body.review);// Create a new review from the data provided in the request body 

    listing.reviews.push(newReview);// Add the newly created review's reference (its ObjectId) to the 'reviews' array of the listing

    await newReview.save();// Save the new review document in the database
    await listing.save();// Save the updated listing document (with the newly added review reference)

    res.redirect(`/listings/${listing._id}`)

}));

//review delete route
router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    // Find the listing by its ID and remove the review reference (ObjectId) from the 'reviews' array
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});// $pull operator removes the reviewId from the 'reviews' array in the listing
    await Review.findByIdAndDelete(reviewId);// Find the review by its ID and delete the review document from the 'Review' collection

    res.redirect(`/listings/${id}`);
}));

module.exports =router;