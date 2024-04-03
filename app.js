const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require("passport");
const session = require("express-session");

require('dotenv').config()
const users = require('./routes/users')
const products = require('./routes/products')
const carts = require('./routes/carts')
const orders = require('./routes/orders')
const auth = require('./routes/auth')

require("./config/passport");


const app = express()
const PORT = process.env.PORT

app.use(session({
    secret : 'Xbcky39003bNusj',
    cookie: {maxAge: 586000},
    saveUninitialized: false,
    resave: false,
    sameSite: 'none',
    secure: true
  }));

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


app.listen(PORT||8000, ()=>{
    console.log(`App running on port ${PORT||8000}.`)
})