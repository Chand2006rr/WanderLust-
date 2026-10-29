const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    created_at:{
        type:Date,
        default:Date.now(),
    }
});

module.exports = mongoose.model("Review",reviewSchema);//validate Review
const validateReview = (req,res,next) => {
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errmsg = err.detais.map((el) =>el.message).join(",");
    throw new ExpressError(400,errmsg);
  }else{
    next();
  }
};
