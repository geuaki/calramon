const express = require('express');
const router = express.Router();

const path = require('path');
const {unlink}= require('fs-extra');

const passport = require('passport');
const Product = require('../models/product');
const ShopProduct = require('../models/shop');

const usuario='';

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

router.get('/origins', async (req, res, next) =>{
    const products = await Product.find();
    const shopProduct= await ShopProduct.find();
    res.render('origins', { products, shopProduct });
});

router.get('/fruita', async (req, res, next) =>{
    const products = await Product.find({"category":"fruita"});
    const shopProduct= await ShopProduct.find();
    res.render('fruita', { products, shopProduct });
});

router.get('/verdura', async (req, res, next) =>{
    const products = await Product.find({"category":"verdura"});
    const shopProduct= await ShopProduct.find();
    res.render('verdura', { products, shopProduct });
});

router.get('/hortalisses', async (req, res, next) =>{
    const products = await Product.find({"category":"hortalisses"});
    const shopProduct= await ShopProduct.find();
    res.render('hortalisses', { products, shopProduct });
});

router.get('/llegums', async (req, res, next) =>{
    const products = await Product.find({"category":"llegums"});
    const shopProduct= await ShopProduct.find();
    res.render('llegums', { products, shopProduct });
});

router.get('/oli', async (req, res, next) =>{
    const products = await Product.find({"category":"oli"});
    const shopProduct= await ShopProduct.find();
    res.render('oli', { products, shopProduct });
});

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};

//LEER PRODUCTOS DE LA CESTA

router.get('/cistella',async (req,res) =>{
    const product= await ShopProduct.find();
    console.log(product);
    res.render('cistella', { product });
});

// FINAL LEER

//AÑADIR A LA CESTA PRODUCTOS

router.post('/addShop',async (req,res) =>{
    var body=req.body;                                      // body del POST
    console.log("El body es: ",req.body);
    var usuario= req.user;                                  // usuario de la sesion
    var identificador=body.id_product;                      // saco el ID del producto   
    const product= await Product.findById(identificador);   // localizo solo ese producto 
    
    console.log("El producto para añadir es" + product);
    const date=Date();
    const shopProduct=new ShopProduct({
        userId: usuario,
        timestamp: date,
        productId: product._id,
        name: product.name,
        weight: product.weight,
        kg: product.kg,
        price: product.price,
        quantity: product.quantity,
        category: product.category,
        description: product.description,
        unit: req.body.quant,
        image: {
            filename: "",
            path: "",
            originalname: "",
            mimetype: "",
            size: ""  
        }  
    });
    await shopProduct.save();
    //console.log(req.file);
    console.log(req.body.id_product);
    console.log(req.body.quant);    
    console.log(req.user);
    console.log("La categoria del producto es "+shopProduct);
    //console.log("El usuario es" + usuario.id);
   //console.log(shopProduct);   
   var url='/'+product.category; //Nos envía a la seccion de la catergoria del producto
   console.log(url);
   res.redirect(url);  //Actualizar los productos en la cesta para cada producto en su etiqueta
  });
// FINAL LEER

// Eliminar productos

router.post('/delete',async (req,res) =>{
    var body=req.body;                                      // body del POST
    //var usuario= req.user                                 // usuario de la sesion
    var identificador=body.id_product;                      // saco el ID del producto;
    const {id}= req.params;
    console.log(id);
    console.log(identificador);                    
    await ShopProduct.findByIdAndDelete(identificador);     // localizo solo ese producto 
    res.redirect('/cistella'); 
    const image = await Image.findByIdAndDelete(id); 
    await unlink(path.resolve('.src/public' + image.path))  //eliminar la imagen ;         
  });

  // Final Eliminar Productos
module.exports = router;