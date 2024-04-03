const express = require('express');
const router = express.Router();
const {query} = require('../db/db');

router.get('/', (req, res) => {
    console.log('try')
    query('SELECT * FROM carts ORDER BY id ASC',(error, results) => {
        if(error){
            throw error
        }
        res.status(200).json(results.rows)
    } )
});

module.exports = router;