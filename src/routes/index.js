const express = require('express');
const router = express.Router();
const { unlink } = require('fs-extra');
const path = require('path');

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

router.get('/producte/:id', async (req, res, next) =>{
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('perfilproducte', { product });
});

router.use((req, res, next) => {
    isAuthenticated(req, res, next);
}); 

router.get('/profile', (req, res, next) =>{
    res.render('profile');
});

/* router.use((req, res, next) => {
    isAdmin(req, res, next);
}); */

router.get('/adminProducts', async (req, res, next) => {
    const products = await Product.find()
    res.render('adminProducts', { products });
});

router.post('/add', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.redirect("/adminProducts");
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('editProduct', { product });
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    await Product.update({_id: id}, req.body)
    res.redirect("/adminProducts");
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await Product.remove({_id: id});
    res.redirect("/adminProducts");
});

router.get('/producte/:id/delete', async (req, res, next) =>{
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    await unlink(path.resolve('./src/public' + product.image.path));
    res.redirect('/' + product.category);
});

router.get('/producte/:id/update', async (req, res, next) =>{
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('modificarproducte', { product });
});

router.put('/producte/updateone/:id', async (req, res, next) =>{
    const { name, unit, weight, price, quantity, category, description } = req.body;
    await Product.findByIdAndUpdate(req.params.id, {name, unit, weight, price, quantity, category, description});
    res.redirect("/");
});

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};

/* function isAdmin(req, res, next) {
    if(req.user.isAdmin === true){
        return next();
    }
    res.redirect('/');
} */

module.exports = router;