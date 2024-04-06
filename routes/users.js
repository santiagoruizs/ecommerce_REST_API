const express = require('express');
const router = express.Router();
const {query} = require('../db/db');

//id middleware
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
/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           $ref: '#/definitions/Users'
 */
router.get('/', (req, res) => {
    query('SELECT * FROM users ORDER BY id ASC',(error, results) => {
        if(error){
            throw error
        }
        res.status(200).json(results.rows)
    } )
});
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns a single user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single user
 *         schema:
 *           $ref: '#/definitions/Order'
 */
//Get User By ID
router.get('/:id',checkUserID, (req, res) => {
    query('SELECT * FROM users WHERE id ='+req.params.id,(error, results) => {
        if(error){
            throw error
        }
        res.status(200).json(results.rows)
    })
})

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     tags: 
 *       - Users
 *     description: Updates a single user
 *     produces: application/json
 *     parameters:
 *      - name: id
 *        description: User's id
 *        in: path
 *        required: true
 *        type: integer
 *      - name: name
 *        description: user's name
 *        in: body
 *        required: true
 *        type: string
 *      - name: email
 *        description: user's email
 *        in: body
 *        required: true
 *        type: string
 *      - name: password
 *        description: user's password
 *        in: body
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Successfully updated
 */
//Update User
router.put('/:id',checkUserID, (req, res) => {
    let id = req.params.id
    console.log(req.body)
    let {name, email, password} = req.body 
    query(`UPDATE users set name = '${name}', email='${email}', password='${password}' WHERE id =+${id};`,(error, results) => {
        if(error){
            throw error
        }
        res.status(201).json({message:"Successfully updated", id, name, email, password})
    })
    
})


/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     description: Deletes a single user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
//Delete User By ID

router.delete('/:id',checkUserID, (req, res) => {
    let id = req.params.id
    query('DELETE FROM users WHERE id ='+id+';',(error, results) => {
        if(error){
            throw error
        }
        res.status(204).json({message: "Successfully deleted"})
    })
})

module.exports = router; 