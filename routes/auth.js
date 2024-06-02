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
    passport.authenticate('local-signup', async (err, user, info) => {
      try {
        if (err) {
          // Handle internal server error
          throw err;
        }
        if (!user) {
          // Handle user already exists error
          return res.status(400).json({ error: 'User already exists' });
        }
        // User created successfully
        res.status(201).json({ message: 'Signup successful', user: user });
      } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res);
  });

router.post("/login", async (req, res) => {
    passport.authenticate('local-login', async (err, user, info) => {
        try {
        if (err) {
            // Handle internal server error
            throw err;
        }
        if (!user) {
            // Handle login failed error
            return res.status(401).json({ error: 'Incorrect email or password' });
        }
        // Login successful
        res.status(200).json({ message: 'Login successful', user: user });
        } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        }
    })(req, res);
    });
router.get("/logout", (req, res) => {
    req.logout();
    res.json({msg: "User Logged Out"});
});

router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
      res.status(200).json({ authenticated: true, user: req.user });
  } else {
      res.status(401).json({ authenticated: false });
  }
});


    
module.exports = router; 