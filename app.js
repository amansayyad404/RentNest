const express = require("express");
const app = express();
const mongoose =require("mongoose")
const Listing =require("./models/listing.js");
const path=require("path");
const methodOverride =require("method-override")//HTML forms only support GET and POST methods, so method-override helps to bypass this limitation 
const ejsMate =require("ejs-mate"); //used for common boilerplate code like footer header
const wrapAsync=require("./utils/wrapAsync.js") //handel async error
const ExpressError=require("./utils/ExpressError.js")

const MONGO_URL ="mongodb://127.0.0.1:27017/RentNext" //connecting db------------------//
main().then(()=>{
    console.log("connected to DB")

}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect( MONGO_URL);
}                                                       //-------------------//
//-------------------//
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));//path for views folder
app.use(express.urlencoded({extended:true}))//is used to parse incoming request bodies that are URL-encoded.
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public"))) //to use static files from public folder like css,js
//-------------------//


app.get("/",(req,res)=>{
    res.send("iam root")
})
//index route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListing =await Listing.find({}); //we are getting all data and sending it in allListing 
    res.render("listings/index.ejs", {allListing});
}));

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})


//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{ //when we click on title then it will lead to spesific id
    let {id}= req.params;
   const listing=await Listing.findById(id);
   res.render("listings/show.ejs", {listing});
}));

//create route
app.post("/listings",wrapAsync(async (req,res,next) =>{
   
    if(!req.body.listing){ //if there is no listing in req.body we will throw err
        throw new ExpressError(400,"Send Valid Data For Listing");
    }
        const newlisting=new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings");

})
);

//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}));

//update route
app.put("/listings/:id",wrapAsync(async(req,res)=>{
    if(!req.body.listing){ //if there is no listing in req.body we will throw err
        throw new ExpressError(400,"Send Valid Data For Listing");
    }

    let {id}= req.params;
  await  Listing.findByIdAndUpdate(id,{...req.body.listing})
 res.redirect(`/listings/${id}`)
}));

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let deleteListing =await Listing.findByIdAndDelete(id)
    res.redirect("/listings")

}));


// ---------------------------------------------------
// Handling all undefined routes with app.all(). 
// This will catch any HTTP method (GET, POST, etc.) for undefined routes
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found ")) // Passing a custom 404 error using the ExpressError class to the next middleware (error handler)
})

app.use((err,req,res,next)=>{       //created a middelware for handling error!
   
    let{ statusCode=500 ,message="Something went wrong" }= err;  // Destructuring 'statusCode' and 'message' from the error object (err)
   res.status(statusCode).render("error.ejs",{message})
    // res.status(statusCode).send(message)  // Sending the error message back to the client
})

// ---------------------------------------------------


app.listen(8080, ()=>{

    console.log("server is listning to port:8080");
})