const express = require("express");
const app = express();
const mongoose =require("mongoose")
const path=require("path");
const methodOverride =require("method-override")//HTML forms only support GET and POST methods, so method-override helps to bypass this limitation 
const ejsMate =require("ejs-mate"); //used for common boilerplate code like footer header
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session"); //manage user sessions
const flash=require("connect-flash");//toast msg

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

const sessionOptions ={
    secret:"mysupersecretcode", // A secret key used to sign the session ID cookie for security.
    resave:false, // Prevents the session from being saved back to the session store if it hasn't been modified during the request.
    saveUninitialized:true , // Saves a session that is new but not modified (used to track user even without data).
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge :7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};

app.get("/",(req,res)=>{
    res.send("iam root")
})



app.use(session(sessionOptions));// Middleware to enable session management in the app.
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error =req.flash("error");
    next();
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