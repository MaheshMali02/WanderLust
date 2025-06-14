const express = require("express");
const passport = require("passport");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");
const User = require("../models/user");

const userController=require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", { 
    failureRedirect: "/login", 
    failureFlash: true 
}),userController.login);


// Logout route - Logout user
router.get("/logout", userController.logout);

module.exports = router;

