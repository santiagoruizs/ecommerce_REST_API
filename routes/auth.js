const express = require('express');
const router = express.Router();
const {query, emailExists} = require('../db/db');
const bcrypt = require('bcrypt');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const checkUserEmail = (req, res, next) => {
    query(`SELECT * FROM users WHERE email = '${req.body.email}'`,(error, results) => {
        if(error){
            throw error
        }
        if (results.rows.length === 0){
            next()
        }else{
            res.status(400).send("There is alredy a user with this Email")
        }
    })
}

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    let user = await emailExists(email)
    console.log(user)
    if (!user){
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = { ...name, email, password: hashedPassword };

        query(`INSERT INTO users (name , email, password) VALUES ('${name}', '${email}','${hashedPassword}')`,(error, results) => {
            if(error){
                throw error
            }
            res.status(201).json({name, email, hashedPassword})
        })
    }else{
        res.status(403).send('Email alredy Exists')
    }
    });

router.post("/login",
  passport.authenticate("local-login", {session: false}),
  (req, res , next) => {
    res.json({user : req. user})
  });

module.exports = router; 