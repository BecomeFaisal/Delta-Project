const express = require("express");
const router = express.Router();
const wrapAysnc = require("../utils/wrapAysnc.js")
const Listing  = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListings} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const {upload} = require("../cloudConfig.js");

  //index route
  router.route("/").get(wrapAysnc(listingController.index)).post(isLoggedIn,
    upload.single("Listing[image]"),validateListings,
    wrapAysnc(listingController.createListing));
 
  //new route
  router.get("/new",isLoggedIn,listingController.renderNewForm);

  //show route
  router.route("/:id").get(wrapAysnc(listingController.showListing))
  .put(isLoggedIn,isOwner,upload.single("Listing[image]"),validateListings, wrapAysnc(listingController.updateListing))
  .delete(isLoggedIn,isOwner,wrapAysnc(listingController.destroyListing));
    
  //Edit route
  router.get("/:id/edit",isLoggedIn,isOwner,wrapAysnc(listingController.renderEditForm));
  
    module.exports = router