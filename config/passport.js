const LocalStrategy = require('passport-local').Strategy;
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');

// load user model
const User = require('../models/User');
module.exports=function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'Email', passwordField: 'Password'}, (Email, Password, done)=>{

            //Match User
            User.findOne({
                Email: Email
            }).then(User=>{
                    if(!User){
                        return done(null, false, {message: 'the email is not registered'});
                    }
                    // Match password
                    bcrypt.compare(Password, User.signup_password, (err, isMatch)=>{
                        if(err) throw err;

                        if (isMatch){
                            return done(null, User);
                        }

                        else{
                            return done(null, false, {message: 'password incorrect'} );
                        }
                    
                    });
                })
                .catch(err => console.log(err));

        })
    );

    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });
    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user) =>{
            done(err, user);

        });
    });
}