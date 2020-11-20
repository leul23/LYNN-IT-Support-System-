
const express = require('express');
const router =express.Router();

//Login page
router.get('/login',(req,res)=>res.render('Login'));
//Register page
router.get('/Register',(req,res)=>res.render('Register'));
router.get('/terms-conditions',(req,res)=>res.render('terms-conditions'));

//register handle
router.post('/register',(req,res)=>{
    console.log(req.body)
    res.render('./register');
});
module.exports=router;