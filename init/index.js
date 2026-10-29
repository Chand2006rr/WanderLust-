const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const initData = require("../init/data.js");

main()
.then(res =>{
    console.log("connected successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

const initDb = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialised.");
 };

 initDb();
