const express = require('express');
const router =express.Router();
const bcrypt= require('bcryptjs');
const passport= require('passport');

//password strong cheker
const passwordStrength = require('check-password-strength')

console.log(passwordStrength('asdfasdf').value)
// Weak (It will return weak if the value doesn't match the RegEx conditions)

console.log(passwordStrength('Asdfasdf2020').value)
// Medium

console.log(passwordStrength('A@2asdF2020!!*').value)
// Strong



 // user model
const User = require('../models/User');
// const { getMaxListeners } = require('../models/User');

router.get('/',(req,res)=>res.render('index'));

// app.use('/Account',require('./routes/Account.js'));

router.get('/dashboard',(req,res)=>res.render('dashboard'));
router.get('/register',(req,res)=>res.render('register'));
router.get('/terms-conditions',(req,res)=>res.render('terms-conditions'));
router.get('/login',(req,res)=>res.render('login'));
router.get('/register',(req,res)=>res.render('register'));
router.get('/privacy-policy',(req,res)=>res.render('privacy-policy'));
router.get('/privacy-policy',(req,res)=>res.render('privacy-policy'));


router.post('/register',(req,res)=>{
    
    console.log(req.body);


    // validation
    const { First_name,Last_name, Email,   Signup_username, signup_password, signup_confirm_password,Signup_plan } = req.body;
    let errors = [];

    passwordCheker=passwordStrength(signup_password).value;

    if (!First_name || !Last_name | !Email || !Signup_username || !signup_password || !signup_confirm_password) {
    errors.push({ msg: 'Please enter all fields' });
    }

    if (signup_password != signup_confirm_password) {
    errors.push({ msg: 'Passwords do not match' });
    }
    if(passwordCheker == 'Weak'| 'Medium'){
        console.log(passwordCheker);
        errors.push({ msg: 'Password is weak please use a password that contains ' });
    }

    if (signup_password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
    }
    var checkEmail = Email.split(".").pop();
     
    
    if( checkEmail!= 'com' & checkEmail!= 'net' & checkEmail!= 'org'  ){
        errors.push({ msg: 'please enter a correct domain.' });
    }
    console.log(checkEmail);
    

    if (errors.length > 0) {
    res.render('register', {
        errors,
        First_name,
        Last_name,
        Email,
        Signup_username,
        signup_password,
        signup_confirm_password,
        Signup_plan
    });
    } else {
    
        
    User.findOne({ Email: Email })
        .then(user => {
        if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
            errors,
            First_name,
            Email,
            signup_password,
            signup_confirm_password
        });
        } else {
        const newUser = new User({
            First_name,
            Last_name,
            Email,
            Signup_username,
            signup_password,
            Signup_plan,
            signup_confirm_password

        });
         console.log(newUser);
        
        
       
             
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.signup_password, salt, (err, hash) => {

            if (err) throw err;

            newUser.signup_password = hash;
            newUser.save()
                .then(user => {
                req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                );
                res.redirect('/login');
                })
                .catch(err => console.log(err));
            });
        });
        }
    });
    }
});
// login handler
router.post('/login',  (req, res, next)=>{
    
    const person = require('../models/User');
    const Email=req.body.Email;
    function free_redirect(){
        passport.authenticate('local',{
            successRedirect: '/aaa',
            failureRedirect:'/login',
            failureFlash: true  
          })(req, res, next); 
         
    }
    function standard_redirect(){
        passport.authenticate('local',{
            successRedirect: '/dashboard_for_standard',
            failureRedirect:'/login',
            failureFlash: true  
          })(req, res, next);
       
    
    }
    function premium_redirect(){
        passport.authenticate('local',{
            
            successRedirect:'login/request',
            failureRedirect:'/login',
            failureFlash: true  
          })(req, res, next);
  
    }
    User.findOne({ Email: Email }).then(user => {
        if(user){
            console.log(user)
            
            if(user.Signup_plan=="Free"){
                free_redirect();
            }
            else if(user.Signup_plan=="Standard"){
                standard_redirect();

            }
            else if(user.Signup_plan=="Premium"){
                premium_redirect();
            } 
            else{
                passport.authenticate('local',{
                
                    successRedirect:'aaaa',
                    failureRedirect:'/login',
                    failureFlash: true  
                })(req, res, next);
                res.render('aaaa')   

        }}
        
        else{
            passport.authenticate('local',{
                successRedirect: '/dashboard_for_standard',
                failureRedirect:'/login',
                failureFlash: true  
              })(req, res, next); 
        }
    }).catch(err => {
        
    })
        
});





module.exports=router;