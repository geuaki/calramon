const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const uuid = require('uuid');

const indexRoutes = require('./routes/index');
const methodOverride = require ("method-override");

//inicializaciones
const app = express();
require('./database');
require('./passport/local-auth');

//ficheros staticos
app.use(express.static(path.join(__dirname, 'public')));

//config
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');


//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method"));
app.use(multer({dest: path.join(__dirname, 'public/images/uploads')}).single('image'));
app.use(session({
    secret: 'mysecretsessioncalramon',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.user = req.user;
    next();
});
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: (req, file, cb, filename) => {
        console.log(file);
        cb(null, uuid() + path.extname(file.originalname));
    }
});

app.use(multer({storage}).single('image'));

//rutas
app.use('/', indexRoutes);

//iniciando el servidor
app.listen(app.get('port'), () => {
    console.log('Server on Port', app.get('port'));
});