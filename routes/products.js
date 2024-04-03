const express = require('express');
const router = express.Router();
const query = require('../db/db');

const checkProductID = (req, res, next) => {

    query('SELECT * FROM products WHERE id ='+req.params.id,(error, results) => {
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
//Get All Products
router.get('/', (req, res) => {
    query('SELECT * FROM products ORDER BY id ASC',(error, results) => {
        if(error){
            throw error
        }
        res.status(200).json(results.rows)
    })
});

//Get products By ID
router.get('/:id',checkProductID, (req, res) => {
    query('SELECT * FROM products WHERE id ='+req.params.id,(error, results) => {
        if(error){
            throw error
        }
        res.status(200).json(results.rows)
    })
})
//Update products
router.put('/:id', checkProductID,(req, res) => {
    let id = req.params.id
    let {name, quantity, price, imageUrl} = req.body 
    query(`UPDATE products set name = '${name}', quantity=${quantity}, price=${price}, imageUrl = '${imageUrl}' WHERE id =+${id};`,(error, results) => {
        if(error){
            throw error
        }
        res.status(201).json({id, name, quantity, price, imageUrl})
    })
    
})

//Create products
router.post('/', (req, res) => {
    let {name, quantity, price, imageUrl} = req.body 
    query(`INSERT INTO products (name, quantity, price, imageUrl) VALUES('${name}', ${quantity}, ${price}, '${imageUrl}');`,(error, results) => {
        if(error){
            throw error
        }
        res.status(201).json({name, quantity, price, imageUrl})
    })
    
})
//Delete products By ID
router.delete('/:id',checkProductID, (req, res) => {
    let id = req.params.id
    query('DELETE FROM products WHERE id ='+id+';',(error, results) => {
        if(error){
            throw error
        }
        res.status(204).send()
    })
})

module.exports = router;