const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override")
const ExpressError = require("./utils/expressError");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const mongoose  = require("mongoose");
const favicon = require("serve-favicon");



const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}



const userRouter = require("./routes/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");


app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


const dbUrl = process.env.ATLASDB_URL;


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret:process.env.SECRET
  },
  touchAfter: 24*60*60 //24hrs 
})

store.on("error",()=>{
    console.log("Error in Mongo Session Store",err);
  })

const sessionOptions={
   store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  },
}


  
  app.use(session(sessionOptions));
  app.use(flash());
  
app.use(passport.initialize());
app.use(passport.session ());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})


app.use(methodOverride("_method"));
    main().then(()=>{
        console.log("connected to db");
    })
    .catch( (err)=>{console.log(err)});
  async function main(){
    await mongoose.connect(dbUrl);
  }

//to start route
app.listen(8080,()=>{
    console.log("server is listeninng to port 8080");
})
// .timeout = 120000;


app.use("/",userRouter);
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);


//error route
app.use((err,req,res,next)=>{
    let{statusCode = 500,message = "something went Wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message})
})
  
//universal route
  app.all("*", (req,res,next)=>{
    console.log("Route not found:", req.originalUrl);
    next(new ExpressError(404,"page not Found"));
})


