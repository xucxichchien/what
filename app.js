var express = require('express');
var path = require('path');
const mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');

//connect to db
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(config.database);
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

//Init app
var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//body parser middleware
//parse application 
app.use(bodyParser.urlencoded({extended:false}));
//parse application json
app.use(bodyParser.json());

//express-session mjiddleware
app.use(session({
    secret: 'Keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

//express vali
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

    while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
    }
    return {
        param : formParam,
        msg : msg,
        value : value
    };
    }
}));

//express msg
app.use(require('connect-flash')());
app.use(function (req, res ,next){
    res.locals.messages = require('express-messages')(req, res);
});

//set routes
var pages = require('./routes/pages.js');
var adminpages = require('./routes/adminpages.js');

app.use('/admin/pages', adminpages);
app.use('/', pages);

//localhost
var port = 300;
app.listen(port, function(){
    console.log('started working on port' + port);
});