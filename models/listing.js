const mongoose =require("mongoose");
const Schema =mongoose.Schema;


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
        default:"https://unsplash.com/photos/a-view-of-the-city-of-london-at-night-CV86dtjSifs",   
        set:(v)=> 
            v==="" ? "https://unsplash.com/photos/a-view-of-the-city-of-london-at-night-CV86dtjSifs" :v,
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
    }
});

const Listing =mongoose.model("Listing",listingSchema);
module.exports =Listing;