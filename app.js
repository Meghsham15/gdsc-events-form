const express = require("express")
const bodyParser = require("body-parser")
const request = require("request");
const req = require("express/lib/request");
const res = require("express/lib/response");
const _ = require("lodash");
const app = express();
app.set('view engine', 'ejs');
const mongoose = require("mongoose");

app.use (bodyParser.urlencoded({extended:true}))
app.use (express.static("public"));
mongoose.connect("mongodb+srv://gdscbsiotr2223:gdscbsiotr2223@cluster0.cl9eah7.mongodb.net/Eventsdb");
const eventSchema = new  mongoose.Schema({
    heading:String,
    img:String,
    shortSum:String,
    Info:String
});
const Event = mongoose.model("Event",eventSchema);
const example = new Event({
    heading:"GDSC BSITOR X LUMOS LABS",
    img:"/images/metaverse.jpg",
    shortSum:"Into the Web3 Metaverse, where you will learn about web3, basics of blockchain, NFTs and a lot more!!",
    Info:"Not just one session but you will access to an incredible community where you can find resources, have fun and internship opportunities."
})
// example.save();

app.get("/",function(req,res){
    res.render("home");
});
app.post("/add",function(req,res){
    const event = new Event({
        heading : req.body.heading,
        img : req.body.img,
        shortSum:req.body.shortSum,
        Info:req.body.Info
    });
    event.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    });
    
});

app.get("/events",function(req,res){
    Event.find(function(err,items){
        if(err){
            console.log(err);
        }else{
            res.render("output",{events:items});
        }
    });
    
});

app.post("/delete",function(req,res){
    const delItem = req.body.delItem;
    Event.findByIdAndDelete(delItem,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/events");
        }
    })

});


app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running at server 3000");
});