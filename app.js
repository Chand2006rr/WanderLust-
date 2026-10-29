const express = require("express");
const app = express();
const port = 8080;
const Listing = require("./models/listing.js");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { constants } = require("buffer");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

const listings = require("./routes/listing.js");
 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate); 
app.use(express.static(path.join(__dirname,"public")));

main()
.then (res =>{              
  console.log("connected successfully.")
}) 
.catch(err => console.log(err));   
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
}
 


//Home Route
app.get("/",(req,res) =>{
  res.send("Working.")
});


app.use("/listings",listings);


app.listen(port,() =>{
    console.log(`The server is listening at port : ${port}`);
});