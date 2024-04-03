const express = require('express');
const router = express.Router();
const query = require('../db/db');

const checkUserID = (req, res, next) => {

    query('SELECT * FROM users WHERE id ='+req.params.id,(error, results) => {
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

router.get('/', (req, res) => {
    query('SELECT * FROM users ORDER BY id ASC',(error, results) => {
        if(error){
            throw error
        }
        res.status(200).json(results.rows)
    } )
});

//Get User By ID
router.get('/:id',checkUserID, (req, res) => {
    query('SELECT * FROM users WHERE id ='+req.params.id,(error, results) => {
        if(error){
            throw error
        }
        res.status(200).json(results.rows)
    })
})
//Update User
router.put('/:id',checkUserID, (req, res) => {
    let id = req.params.id
    console.log(req.body)
    let {name, email, password} = req.body 
    query(`UPDATE users set name = '${name}', email='${email}', password='${password}' WHERE id =+${id};`,(error, results) => {
        if(error){
            throw error
        }
        res.status(201).json({id, name, email, password})
    })
    
})

//Create User
router.post('/', (req, res) => {
    console.log(req.body)
    let {name, email, password} = req.body 
    query(`INSERT INTO users (name, email, password) VALUES('${name}', '${email}', '${password}');`,(error, results) => {
        if(error){
            throw error
        }
        res.status(201).json({name, email, password})
    })
    
})
//Delete User By ID
router.delete('/:id',checkUserID, (req, res) => {
    let id = req.params.id
    query('DELETE FROM users WHERE id ='+id+';',(error, results) => {
        if(error){
            throw error
        }
        res.status(204).send()
    })
})

module.exports = router; 