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
router.get('/:id', checkOrderID,(req, res) => {
    console.log('try')
    query('SELECT * FROM orders WHERE id = $1',[req.params.id], (error, results) => {
        if(error){
            throw error
        }
        res.status(200).json(results.rows)
    } )
});

module.exports = router;