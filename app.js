const express = require('express');
var path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require("passport");
const session = require("express-session");
const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config()
require("./config/passport");
//Routes
const users = require('./routes/users')
const products = require('./routes/products')
const carts = require('./routes/carts')
const orders = require('./routes/orders')
const auth = require('./routes/auth')


const PORT = process.env.PORT

const app = express()
// swagger definition
var swaggerDefinition = {
    info: {
      title: 'Node Swagger API',
      version: '1.0.0',
      description: 'Demonstrating how to describe a RESTful API with Swagger',
    },
    host: 'localhost:3000',
    basePath: '/',
  };
  
// options for the swagger docs
var options = {
// import swaggerDefinitions
swaggerDefinition: swaggerDefinition,
// path to the API docs
apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);



app.get('/swagger.json', function(req, res) {
res.setHeader('Content-Type', 'application/json');
res.send(swaggerSpec);
});


app.use(session({
    secret : 'Xbcky39003bNusj',
    cookie: {maxAge: 586000},
    saveUninitialized: false,
    resave: false,
    sameSite: 'none',
    secure: true
  }));

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  console.log(err)
  res.status(500).send('Something broke!');
};

app.use(cors())
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    res.status(200).json({status:'Ok'})
})


app.use('/auth', auth)
app.use('/users', users)
app.use('/products', products)
app.use('/carts', carts)
app.use('/orders', orders)
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorHandler);

app.listen(PORT||8000, ()=>{
    console.log(`App running on port ${PORT||8000}.`)
})