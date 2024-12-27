const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAysnc.js");
const passport = require("passport");
const { ref } = require("joi");
const { saveRedirectUrl } = require("../middleware.js");
const userController  = require("../controllers/users.js");
const listingController = require("../controllers/listings.js");


router.route("/").get(wrapAysnc(listingController.index)).post(isLoggedIn,
    upload.single("Listing[image]"),validateListings,
    wrapAysnc(listingController.createListing));

router.route("/signup").get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
    userController.login);

router.get("/logout",userController.logout);

module.exports = router;
