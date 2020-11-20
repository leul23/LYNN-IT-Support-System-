const express = require('express');
const router =express.Router();
const bcrypt= require('bcryptjs');
const passport= require('passport');

 // user model
 const User = require('../models/User');

router.get('/',(req,res)=>res.render('index'));

// router.get('/dashboard',(req,res)=>res.render('dashboard'));
//  router.get('/register',(req,res)=>res.render('register'));
router.get('/terms-conditions',(req,res)=>res.render('terms-conditions'));
router.get('/login',(req,res)=>res.render('login'));
router.get('/register',(req,res)=>res.render('register'));
router.get('/privacy-policy',(req,res)=>res.render('privacy-policy'));
// router.get('/privacy-policy',(req,res)=>res.render('privacy-policy'));

//register handle
router.post('/register',(req,res)=>{
    
    console.log(req.body);


    //validation
    const { First_name,Last_name, Email,   Signup_username, signup_password, signup_confirm_password,Signup_plan } = req.body;
    let errors = [];

    if (!First_name || !Last_name | !Email || !Signup_username || !signup_password || !signup_confirm_password) {
    errors.push({ msg: 'Please enter all fields' });
    }

    if (signup_password != signup_confirm_password) {
    errors.push({ msg: 'Passwords do not match' });
    }

    if (signup_password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
    res.render('register', {
        errors,
        First_name,
        Last_name,
        Email,
        Signup_username,
        signup_password,
        signup_confirm_password
    });
    } else {
    User.findOne({ Email: Email }).then(user => {
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
            Signup_plan
            // signup_confirm_password

        });
         console.log(newUser)
        // res.send('hello');
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
router.post('/login', (req, res, next)=>{
    passport.authenticate('local',{
      successRedirect: '/dashboard',
      failureRedirect:'/login',
      failureFlash: true  
    })(req, res, next);
        
});


module.exports=router; 