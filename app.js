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

const Plan = require('./models/plan')
const PlanRouter = require('./routes/plans')


//**********chat */

const path = require('path');
const http = require('http');

const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');


const server = http.createServer(app);
const io = socketio(server);
const ChatName = 'LYNN CHAT ';
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
      const user = userJoin(socket.id, username, room);
  
      socket.join(user.room);
  
      // Welcome current user
      socket.emit('message', formatMessage(ChatName, 'Welcome to LYNN CHAT!'));
  
      // Broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit(
          'message',
          formatMessage(ChatName, `${user.username} has joined the chat`)
        );
  
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });
  
    // Listen for chatMessage
    socket.on('chatMessage', msg => {
      const user = getCurrentUser(socket.id);
  
      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
  
    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
  
      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage(ChatName, `${user.username} has left the chat`)
        );
  
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });

//**********chat */

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
// routes
app.use('/',require('./routes/index.js'));
// app.use('/Accounts',require('./routes/Accounts.js'));


//  app.use('/index',require('./routes/index.js'));
// app.use('/Accounts',require('./routes/Accounts.js'));

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


 //plan
 app.use(methodOverride('_method'))

 app.get('/plan',async (req,res) => {
     const plans = await Plan.find().sort({createdAt: 'desc'})
     res.render('plans/index', {plans : plans})
 })
 app.get('/login/plan',async (req,res) => {
     const plans = await Plan.find().sort({createdAt: 'desc'})
     res.render('plans/create', {plans : plans})
 })
 app.get('/plan/thanks',async (req,res) => {
     res.render('plans/thanks')
 })
 //this will add Request in url 
 app.use('/plans', PlanRouter)

 
const PORT=process.env.PORT||5000;
server.listen(PORT, console.log(`server started on port ${PORT}`));
