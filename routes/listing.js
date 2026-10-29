const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");

//validate listing
const validateListing = (req,res,next) => {
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errmsg = error.details.map((el) =>el.message).join(",");
    throw new ExpressError(400,errmsg);
  }else{
    next();
  }
};

// index Route - /listing
router.get("/",wrapAsync(async(req,res) =>{
  const allListing = await Listing.find({});
  res.render("listings/index.ejs",{ allListing }); 
})
);
 
// new route 
router.get("/new",wrapAsync(async(req,res) =>{ 
  res.render("listings/new.ejs"); 
}));

// show route 
router.get("/:id",wrapAsync(async(req,res)=>{
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs",{ listing });
})
);


// create route 
router.post("/",
  validateListing,
  wrapAsync(async(req,res,next) =>{
  let newlisting = new Listing(req.body.listing);
  await newlisting.save();
  res.redirect("/listings");
}));

//edit route
router.get("/:id/edit",wrapAsync(async(req,res) =>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs",{ listing });
})
);   

// //update route
router.put("/:id", wrapAsync(async(req, res) => {
   let listing = await Listing.findById(req.params.id);
   // keep old image if form doesn't send new one
   req.body.listing.image = listing.image;
   await Listing.findByIdAndUpdate(req.params.id, req.body.listing);

   res.redirect(`/listings/${req.params.id}`);
})
);


//Delete Route
router.delete("/:id",wrapAsync(async(req,res) =>{
  let {id} = req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
})
);


module.exports = router;