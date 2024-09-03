const express = require("express");
const app = express();
const mongoose =require("mongoose")
const Listing =require("./models/listing.js");
const path=require("path");
const methodOverride =require("method-override")

const MONGO_URL ="mongodb://127.0.0.1:27017/RentNext" //connecting db------------------//

main().then(()=>{
    console.log("connected to DB")

}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect( MONGO_URL);
}                                                       //-------------------//

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))

app.get("/",(req,res)=>{
    res.send("iam root")
})
//index route
app.get("/listings",async (req,res)=>{
    const allListing =await Listing.find({}); //we are getting all data and sending it in allListing 
    res.render("listings/index.ejs", {allListing});
})
//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})


//show route
app.get("/listings/:id",async (req,res)=>{ //when we click on title then it will lead to spesific id
    let {id}= req.params;
   const listing=await Listing.findById(id);
   res.render("listings/show.ejs", {listing});
})

//create route
app.post("/listings",async (req,res) =>{
    const newlisting=new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
})

//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}= req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
})

//update route
app.put("/listings/:id",async(req,res)=>{
    let {id}= req.params;
  await  Listing.findByIdAndUpdate(id,{...req.body.listing})
 res.redirect(`/listings/${id}`)
})

//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}= req.params;
    let deleteListing =await Listing.findByIdAndDelete(id)
    res.redirect("/listings")

})

app.listen(8080, ()=>{

    console.log("server is listning to port:8080");
})