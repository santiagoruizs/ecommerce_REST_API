const express = require('express');
const router = express.Router();
const {query} = require('../db/db');

const checkOrderID = (req, res, next) => {

    query('SELECT * FROM orders WHERE id = $1',[req.params.id],(error, results) => {
        if(error){
            throw error
        }
        if (results.rowCount > 0){
            next()
        }else{
            res.status(400).send("Invalid Order Id")
        }
    })
}
/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *       - Orders
 *     description: Returns all orders
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of orders
 *         schema:
 *           $ref: '#/definitions/Orders'
 */
router.get('/', (req, res) => {
    console.log('try')
    query('SELECT * FROM orders ORDER BY id ASC',(error, results) => {
        if(error){
            throw error
        }
        res.status(200).json(results.rows)
    } )
});
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     description: Returns a single order
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Order's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single order
 *         schema:
 *           $ref: '#/definitions/Order'
 */
router.get('/:id',(req, res) => {
    console.log('try')
    query('select o.order_date,o.price as total_price, o.id, o.cart_id, cp.product_id, p.name, cp.quantity, p.price,p.imageurl  from orders as o '+
    'inner join carts as c on o.cart_id = c.id '+
    'inner join cart_products as cp on cp.cart_id = c.id '+
    'inner join products as p on p.id = cp.product_id '+
    'WHERE o.user_id =$1',[req.params.id], (error, results) => {
        if(error){
            throw error
        }
        const orders = {};

        results.rows.forEach(row => {
            const { id, order_date, product_id, name, quantity, price, imageurl, total_price } = row;

            if (!orders[id]) {
            orders[id] = {
                id,
                date: order_date,
                total_price,
                products: []
            };
            }

            orders[id].products.push({
            product_id,
            name,
            quantity,
            price,
            imageurl
            });
        });
        res.status(200).json(Object.values(orders))
    } )
});

module.exports = router;