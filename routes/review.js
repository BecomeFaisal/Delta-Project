const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAysnc = require("../utils/wrapAysnc.js")
const ExpressError = require("../utils/expressError.js");
const {reviewSchema} = require("../schema.js");
const Listing  = require("../models/listing.js");
const Review = require("../models/reviews.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//post review route
router.post("/",isLoggedIn,validateReview, wrapAysnc(reviewController.createReview));
  //delete route for review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAysnc(reviewController.destroyReview))
    
module.exports = router;