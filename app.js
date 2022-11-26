const express = require("express")
const bodyParser = require("body-parser")
const request = require("request");
const req = require("express/lib/request");
const res = require("express/lib/response");
const _ = require("lodash");
const passport = require("passport");
const passportLocal = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const app = express();
app.set('view engine', 'ejs');
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));
app.use(session({
    secret: "GDSC Bsiotr First website",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://gdscbsiotr2223:gdscbsiotr2223@cluster0.cl9eah7.mongodb.net/Eventsdb");
const eventSchema = new mongoose.Schema({
    heading: String,
    img: String,
    shortSum: String,
    Info: String
});
const Event = mongoose.model("Event", eventSchema);

const userSchema = new mongoose.Schema({
    password: String,
    username: String
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username, name: user.name });
    });
});
passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});
const example = new Event({
    heading: "GDSC BSITOR X LUMOS LABS",
    img: "/images/metaverse.jpg",
    shortSum: "Into the Web3 Metaverse, where you will learn about web3, basics of blockchain, NFTs and a lot more!!",
    Info: "Not just one session but you will access to an incredible community where you can find resources, have fun and internship opportunities."
})
// example.save();

app.get("/", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("home");
    } else {
        res.redirect("/login");
    }
});
app.post("/add", function (req, res) {
    if (req.isAuthenticated()) {
        const event = new Event({
            heading: req.body.heading,
            img: req.body.img,
            shortSum: req.body.shortSum,
            Info: req.body.Info
        });
        event.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/");
            }
        });
    } else {
        res.redirect("/events");
    }


});

app.get("/events", function (req, res) {

    if (req.isAuthenticated()) {
        Event.find(function (err, items) {
            if (err) {
                console.log(err);
            } else {
                res.render("output", { events: items });
            }
        });
    } else {
        res.redirect("/login");
    }

});

app.post("/delete", function (req, res) {

    if (req.isAuthenticated()) {
        const delItem = req.body.delItem;
        Event.findByIdAndDelete(delItem, function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/events");
            }
        });
    } else {
        res.redirect("/login");
    }

});
app.get("/register", function (req, res) {
    res.render("register");
});
app.get("/login", function (req, res) {
    res.render("login");
});


app.post("/register", function (req, res) {
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res,
                function () {
                    res.redirect("/");
                });
        }
    });
});

app.post("/login", function (req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/");
            })
        }
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running at server 3000");
});