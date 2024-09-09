const express = require("express");
const app = express();
const mongoose =require("mongoose")
const path=require("path");
const methodOverride =require("method-override")//HTML forms only support GET and POST methods, so method-override helps to bypass this limitation 
const ejsMate =require("ejs-mate"); //used for common boilerplate code like footer header
const ExpressError=require("./utils/ExpressError.js")


const listings = require("./routes/listing.js"); //routes
const reviews =require("./routes/review.js");    //routes

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



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);




// ---------------------------------------------------
// Handling all undefined routes with app.all(). 
// This will catch any HTTP method (GET, POST, etc.) for undefined routes
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found ")) // Passing a custom 404 error using the ExpressError class to the next middleware (error handler)
})

app.use((err,req,res,next)=>{       //created a middelware for handling error!
   
    let{ statusCode=500 ,message="Something went wrong" }= err;  // Destructuring 'statusCode' and 'message' from the error object (err)
   res.status(statusCode).render("error.ejs",{message})
  //Sending the error message back to the client
})

// ---------------------------------------------------


app.listen(8080, ()=>{

    console.log("server is listning to port:8080");
})