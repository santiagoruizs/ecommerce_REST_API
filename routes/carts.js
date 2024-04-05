const express = require('express');
const router = express.Router();
const {query} = require('../db/db');
// Middleware to check valid cart id
const checkCartID = (req, res, next) => {

    query('SELECT * FROM carts WHERE id ='+req.params.id,(error, results) => {
        if(error){
            throw error
        }
        if (results.rowCount > 0){
            next()
        }else{
            res.status(400).send("Invalid Cart Id")
        }
    })
}
const checkProductID = (req, res, next) => {

    query('SELECT * FROM products WHERE id ='+req.body.product_id,(error, results) => {
        if(error){
            throw error
        }
        if (results.rows.length > 0){
            next()
        }else{
            res.status(400).send("Invalid Id")
        }
    })
}
//Get Cart Info
router.get('/:id',checkCartID, (req, res) => {
    query('select cp.*, p.name, p. category, p.price, p.quantity * p.price as total_price from cart_products as cp ' +
    'inner join products as p on p.id = cp.product_id WHERE cp.cart_id = $1;',[req.params.id],(error, results) => {
        if(error){
            throw error
        }
        res.status(200).json(results.rows)
    })
})
//Create New Empty Cart
router.post('/', (req, res) => {
    query('INSERT INTO carts ( user_id, checked_out) VALUES($1, $2)', [req.body.user_id, false],(error, results) => {
        if(error){
            throw error
        }
        res.status(201).json(results.rows)
    })
});
// Add element to the cart
router.post('/:id', checkCartID, checkProductID, (req, res) => {
    query('INSERT INTO cart_products (cart_id,product_id, quantity) VALUES ($1, $2, $3) ', [req.params.id, req.body.product_id, req.body.quantity],(error, results) => {
        if(error){  
            throw error
        }
        res.status(201).json(results.rows)
    } )
});
module.exports = router;