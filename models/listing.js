const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review = require("./review.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",  // Referencing the User model
    },
    // geometry:{
    //     type:String,//don't do"{location {type:string}}
    //     enum:["Point"],
    //     required:true,
    // },
    //     coordinates:{
    //         type:[Number],
    //         required:true,
    // },

// try by yourself homework
    // category:{
    //     type:String,
    //     enum:["mountain","arctic","farms","deserts","pool"],
    // },

});

// post mongoose middleware (it is used when our entiry listing means one hotel card is deleted it should delete whole reviews as well in the database)
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;
