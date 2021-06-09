const express = require('express');
const router = express.Router();

const path = require('path');
const {unlink}= require('fs-extra');

const passport = require('passport');
const Product = require('../models/product');
const ShopProduct = require('../models/shop');
const salesSchema = require('../models/sales');
const { findByIdAndDelete } = require('../models/product');


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

/*  Pagina Informacion
router.get('/origins', async (req, res, next) =>{
    const products = await Product.find();
    const shopProduct= await ShopProduct.find();
    res.render('origins', { products, shopProduct });
});
*/
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

router.get('/producte/:id', async (req, res, next) =>{
    const { id } = req.params;
    const product = await Product.findById(id);
    const shopProduct= await ShopProduct.find();
    res.render('perfilproducte', { product, shopProduct });
});

router.use((req, res, next) => {
    isAuthenticated(req, res, next);
}); 

router.get('/profile', (req, res, next) =>{
    res.render('profile');
});

router.get('/adminProducts',isAdmin, async (req, res, next) => {
    const products = await Product.find()
    res.render('adminProducts', { products });
});

router.post('/add',isAdmin, async (req, res) => {
    const product = new Product(req.body);
    console.log("El body es: ",req.body);
    await product.save();
    res.redirect("/adminProducts");
});

router.get('/edit/:id',isAdmin, async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('editProduct', { product });
});

router.post('/edit/:id',isAdmin, async (req, res) => {
    const { id } = req.params;
    await Product.update({_id: id}, req.body)
    res.redirect("/adminProducts");
});

router.get('/delete/:id',isAdmin, async (req, res) => {
    const { id } = req.params;
    await Product.remove({_id: id});
    res.redirect("/adminProducts");
});

router.get('/producte/:id/delete',isAdmin, async (req, res, next) =>{
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    await unlink(path.resolve('./src/public' + product.image.path));
    res.redirect('/' + product.category);
});

router.get('/producte/:id/update',isAdmin, async (req, res, next) =>{
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('modificarproducte', { product });
});

router.put('/producte/updateone/:id',isAdmin, async (req, res, next) =>{
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

function isAdmin(req, res, next){
    if(req.user.isAdmin){
        return next();
    }
    res.redirect('/');
}

//LEER PRODUCTOS DE LA CESTA

router.get('/cistella',async (req,res) =>{
    const usuario=req.user;    
    const totalShop= await ShopProduct.find();
    let product = totalShop.filter((shop) =>{             // Descargamos toda la cesta y filtramos por usuario
        console.log(shop);                                // con filter creamos el nuevo array de productos
        console.log("El id del producto es: "+shop.id)
        if(shop.userId==usuario.id) {
            return shop;
        }
    });
    res.render('cistella', { product });
});

// FINAL LEER

//AÑADIR A LA CESTA PRODUCTOS

router.post('/addShop',async (req,res) =>{
    var body=req.body;                                      // body del POST    
    var usuario= req.user;                                  // usuario de la sesion
    var identificador=body.id_product;                      // saco el ID del producto   
    const product= await Product.findById(identificador);   // localizo solo ese producto 
    
    console.log("El producto para añadir es" + product);
    const date=Date();
    const shopProduct=new ShopProduct({
        userId: usuario.id,
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
    console.log(req.body.id_product);
    console.log(req.body.quant);    
    console.log(req.user);
    console.log("La categoria del producto es "+shopProduct);   
   var url='/'+product.category;                                //Nos envía a la seccion de la catergoria del producto
   console.log(url);
   res.redirect(url);                                          //Actualizar los productos en la cesta para cada producto en su etiqueta
  });
// FINAL AÑADIR PRODUCTOS

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
/* function isAdmin(req, res, next) {
    if(req.user.isAdmin === true){
        return next();
    }
    res.redirect('/');
} */

//RESTAR AL STOCK PRODUCTOS DESPUES DE COMPRAR 

router.get('/buyShop', async (req,res) =>{    
    const usuario=req.user;    
    const totalShop= await ShopProduct.find();
    let basket = totalShop.filter((shop) =>{             // Descargamos toda la cesta y filtramos por usuario
        console.log(shop);                               // con filter creamos el nuevo array de productos        
        if(shop.userId==usuario.id) {
            return shop;
        }
    });
    const producto = await Product.find();    
    basket.forEach(function (basket) {        
        var id=basket.productId;
        var unidades=basket.unit;
        var stock;
        producto.forEach(function(producto){
            if (id==producto.id){
                stock=producto.quantity-unidades;
                if (stock >= 0){
                    Product.findByIdAndUpdate(id,{
                    quantity: stock
                },(error,product)=>{
                    console.log(error,id)
                })
            }else{
                console.log("No hay cantidad suficiente")
            }
            }
        })
    });
    const date=Date();
    const SalesSchema = new salesSchema({
        userId: req.user,
        timestamp: date, 
        products: basket       
    });
    await SalesSchema.save();
    basket.forEach(function(basket){
        const id= basket.id;
        ShopProduct.findByIdAndDelete(id,{
        },(error,basket)=>{
            console.log(error,id)
        });
    });
    res.redirect('/');
    
});

// FIN RESTAR STOCK 



module.exports = router;