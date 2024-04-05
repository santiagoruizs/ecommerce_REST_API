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

router.post("/signup", 
    passport.authenticate('local-signup', {session: false}),
    (req, res) => {
        res.status(201).json({ message: 'Signup successful', user: req.user });
    }
    );

router.post("/login",
  passport.authenticate("local-login", {session: false}),
  (req, res , next) => {
    res.json({message: 'Login successful', user : req.user})
  });

module.exports = router; 