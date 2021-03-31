const express = require('express');
const router = express.Router();

const passport = require('passport');

const Product = require('../models/product');

router.get('/', (req, res, next) =>{
    res.render('index');
});

router.get('/signup', (req, res, next) =>{
    res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true
}));

router.get('/signin', (req, res, next) =>{
    res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
}));

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.get('/profile',  isAuthenticated, (req, res, next) =>{
    res.render('profile');
});

router.get('/fruita', async (req, res, next) =>{
    const products = await Product.find({"category":"fruita"});
    res.render('fruita', { products });
});

router.get('/verdura', async (req, res, next) =>{
    const products = await Product.find({"category":"verdura"});
    res.render('verdura', { products });
});

router.get('/hortalisses', async (req, res, next) =>{
    const products = await Product.find({"category":"hortalisses"});
    res.render('hortalisses', { products });
});

router.get('/llegums', async (req, res, next) =>{
    const products = await Product.find({"category":"llegums"});
    res.render('llegums', { products });
});

router.get('/oli', async (req, res, next) =>{
    const products = await Product.find({"category":"oli"});
    res.render('oli', { products });
});

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};
module.exports = router;