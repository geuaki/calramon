const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');

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


//rutas
app.use('/', require('./routes/index'));

//iniciando el servidor
app.listen(app.get('port'), () => {
    console.log('Server on Porta', app.get('port'));
});