const mongoose =require("mongoose");
const Schema =mongoose.Schema;
const Review =require("./review.js");

const listingSchema =new Schema({

    title:{
        type: String,
        require:true,
    },
    description:{
        type: String,
    },
    image:{
        type:String,    
        default:"https://images.unsplash.com/photo-1725345652714-94631e3be8ea?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",   
        set:(v)=> 
            v==="" ? "https://images.unsplash.com/photo-1725345652714-94631e3be8ea?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" :v,
         //if user have not given any img then default img will be placed 
    
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type : Schema.ObjectId, // Each review is referenced by its unique ObjectId from the 'Review' collection
            ref : "Review",
        }
    ]
});

//when we delete any listing then all reviews associted with that review should be deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
       
        // listing.reviews contains an array of "review IDs"
        // The $in operator selects all reviews where the _id is in the listing.reviews array
        await Review.deleteMany({_id :{$in :listing.reviews}});
    }
})
// ----------------------------------------------------------------

const Listing =mongoose.model("Listing",listingSchema);
module.exports =Listing;