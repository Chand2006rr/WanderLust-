const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


//validate Review
const validateReview = (req,res,next) => {
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errmsg = error.details.map((el) =>el.message).join(",");
    throw new ExpressError(400,errmsg);
  }else{
    next();
  }
}; 


//Reviews
//Post Review Route
router.post("/",validateReview,
  wrapAsync(async(req,res) =>{
  console.log(req.params.id);
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review); 
  await newReview.save();
  listing.reviews.push(newReview._id);
  await listing.save();

  console.log("working well");
  // res.redirect(`/listings/${listing._id}`);
  res.redirect(`/listings/${listing._id}`)
}) 
);


//Delete Reviews
router.delete("/:reviewId",wrapAsync(async(req,res) =>{
  let {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);

}));


module.exports = router;