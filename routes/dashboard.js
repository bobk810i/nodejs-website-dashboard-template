const express = require('express');
const passport = require('passport');
const router = express.Router();
const logger = require('../modules/logger');
router.use(express.static('public'));

const {checkAuthenticated, changePassword} = require('../modules/authentication');

// Routes to pages
router.get('/', checkAuthenticated, (req, res)=>{
    res.status(200).render('dashboard/main');
})

// Account settings route
router.get('/account', checkAuthenticated, (req, res)=>{
    res.status(200).render('dashboard/account', {username: req.session.passport.user.login});
})

// Login/logout routes
router.get('/login', (req, res)=>{
    res.status(200).render('dashboard/login');
})

router.post("/login", passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/dashboard/login",
 }))

 router.get('/logout', (req, res)=>{
    req.logOut((err)=>{
        if(err){
            logger.error({"description": `Error while logging out!`, "Error": err});
        }
        res.redirect('/dashboard/login');
    });
 })


// Change password
router.post('/changePass', checkAuthenticated, (req, res)=>{
    changePassword(req.session.passport.user.login, req.body, res);
})

module.exports = router;