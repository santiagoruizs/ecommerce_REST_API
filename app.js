const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const users = require('./routes/users')
const products = require('./routes/products')
const carts = require('./routes/carts')
const orders = require('./routes/orders')


const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(200).send('Ok')
})

app.use('/users', users)
app.use('/products', products)
app.use('/carts', carts)
app.use('/orders', orders)


app.listen(PORT||8000, ()=>{
    console.log(`App running on port ${PORT||8000}.`)
})