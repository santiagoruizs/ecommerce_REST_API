const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const {query, emailExists} = require('../db/db')

// Set up the Passport strategy:
passport.use("local-login",
  new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        }, 
        async (email, password, done) => {
            try{
                const user = await emailExists(email);
                if (!user) return done(null, false)
                const matchedPassword = await bcrypt.compare(password, user.password)
                if(!matchedPassword) return done(null, false)
                return done(null, user)
            }catch(error){
                return done(error)
            }
                    
    })
)

// Serialize a user
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// Deserialize a user
passport.deserializeUser((id, done) => {
    query(`SELECT * FROM users WHERE id = ${id}`, (error, results) => {

        if(error) return done(error)

        if (results.rows.length === 0) return done(null, false)

        return done(null, results.rows[0])
        
        })
})

