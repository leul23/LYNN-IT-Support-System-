const express =require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose =require('mongoose');
const app =express();
var bodyParser=require('body-parser');
const flash =require('connect-flash');
const session =require('express-session');
const passport= require('passport');

const Request = require('./models/request')
const methodOverride = require('method-override')
const RequestRouter = require('./routes/requests')

// passport config
require('./config/passport')(passport);

//db config
 const db= require('./config/keys').MongoURI;


//connect to mongo
mongoose.connect('mongodb://localhost:27017/practice', {useNewUrlParser: true, useUnifiedTopology: true})
// mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true } )
    .then(()=>console.log('mongodb connected'))
    .catch(err=> console.log(err));


//EJS
// app.use(expressLayouts);
app.use(express.static("public"));
app.set('view engine', 'ejs');

//body parser
//app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));

// express session
app.use(session({
    secret: 'secret',
    resave:true,
    saveUninitialized: true,
   
}));
// passport middleware(for login)
app.use(passport.initialize());
app.use(passport.session());


// connect flash(flash messages)
app.use(flash());

//global vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
//request
app.use(methodOverride('_method'))

app.get('/request',async (req,res) => {
    const requests = await Request.find().sort({createdAt: 'desc'})
    res.render('requests/index', {requests : requests})
})
app.get('/login/request',async (req,res) => {
    const requests = await Request.find().sort({createdAt: 'desc'})
    res.render('requests/create', {requests : requests})
})
app.get('/request/thanks',async (req,res) => {
    res.render('requests/thanks')
})
//this will add Request in url 
app.use('/requests', RequestRouter)


// routes

app.use('/',require('./routes/index.js'));

 app.use('/index',require('./routes/index.js'));
const PORT=process.env.PORT||5000;
app.listen(PORT, console.log(`server started on port ${PORT}`));
