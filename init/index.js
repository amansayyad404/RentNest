const mongoose =require("mongoose");
const initData =require("./data.js");
const Listing =require("../models/listing.js");

const MONGO_URL ="mongodb://127.0.0.1:27017/RentNext" //connecting db---------and initalization---------//

main().then(()=>{
    console.log("connected to DB")

}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect( MONGO_URL);
}                                                      


const initDB= async ()=>{
   await Listing.deleteMany({}); //it will delete all data in collection 
   initData.data= initData.data.map((obj) => ({...obj, owner : "66e2812e6d8b53868ea5c621" }))
   await Listing.insertMany(initData.data); //insert data "initData"
   console.log("data was initalized");
};
initDB();
 //-------------------//