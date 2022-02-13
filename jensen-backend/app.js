
const cors = require("cors")
const express = require("express")
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const https = require ('https')
const path = require('path')
const fs = require('fs')
const mongoose = require ('mongoose')
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
require("dotenv").config();
const app = express()
const passport = require('passport')



 // SSL

  const sslServer = https.createServer({
      key: fs.readFileSync(path.join(__dirname, 'certificates', 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'certificates', 'cert.pem')),
     },
     app
   )
  sslServer.listen(5500,()=> console.log('SSL på 5500'))

//Passport
require('./config/passport')(passport);



//EJS med layout, svårt att styla ejs samt länka html.
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));


//express session
app.use(session({
   secret: 'hemlis',
   resave: false,
   saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//routes
app.use('/', require('../jensen-backend/routes/index'));
app.use('/users', require('../jensen-backend/routes/users'));
app.set('views', path.join('../jensen-frontend/views'));


//db connect
mongoose.connect(
   process.env.DB_CONNECT,
   () => console.log('DB connectad iaf!')
);

 //import routes
// const authRoute = require ('./routes/auth');
const postRoute = require ('./routes/posts');
const logger = require("./config/logger")

 //middleware

 app.use(express.json());

//  //route middlewares
//  app.use('login', postRoute);


//heroku
 app.use(function (req, res, next) {
   res.setHeader('Content-Security-Policy', "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'");
    next();
 });

 app.use('/healthcheck', require('./routes/healthcheck.routes'));

 app.use(express.urlencoded({ extended: true }));
 app.use(cors())

