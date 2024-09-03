const express = require("express");
const app = express();
const mongoose =require("mongoose")
const Listing =require("../models/listing.js");

const MONGO_URL ="mongodb://127.0.0.1:27017/RentNext" //connecting db------------------//

main().then(()=>{
    console.log("connected to DB")

}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect( MONGO_URL);
}                                                       //-------------------//


app.get("/",(req,res)=>{
    res.send("iam root")
})

app.listen(8080, ()=>{

    console.log("server is listning to port:8080");
})