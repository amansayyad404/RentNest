const express =require("express")
const router = express.Router();//function used to create a new router object that can handle routes and middleware separately from the main application.
const wrapAsync=require("../utils/wrapAsync.js") //handel async error
const Listing =require("../models/listing.js");
const {IsLoggedIn, isOwner, validateListing}=require("../middleware.js");

const listingController = require("../controllers/listings.js")

// ---------------------------------------------------------

router.route("/") //if req is get then GET will be called and if it is on post then POST will be called
    .get(wrapAsync(listingController.index)) //index route
    .post(IsLoggedIn, validateListing, wrapAsync(listingController.createListing));//create route


//new route
router.get("/new",IsLoggedIn,listingController.renderNewForm)

router.route("/:id")
      .get(wrapAsync(listingController.showListing)) //show route
      .put(IsLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing)) //update route
      .delete(IsLoggedIn,isOwner,wrapAsync(listingController.destroyListing)); //delete route

//edit route
router.get("/:id/edit",IsLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports =router;