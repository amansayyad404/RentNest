const express =require("express")
const router = express.Router();//function used to create a new router object that can handle routes and middleware separately from the main application.
const wrapAsync=require("../utils/wrapAsync.js") //handel async error
const Listing =require("../models/listing.js");
const {IsLoggedIn, isOwner, validateListing}=require("../middleware.js");

const listingController = require("../controllers/listings.js")

// ---------------------------------------------------------
//index route
router.get("/",wrapAsync(listingController.index));

//new route
router.get("/new",IsLoggedIn,listingController.renderNewForm)

//show route
router.get("/:id",wrapAsync(listingController.showListing));

//create route
router.post("/",IsLoggedIn, validateListing, wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit",IsLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//update route
router.put("/:id",IsLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id",IsLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports =router;