const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const {query, emailExists} = require('../db/db')
// Set up the Passport Signup strategy:
passport.use("local-signup",
  new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
        }, 
        async (req, email, password, done) => {
            const { name } = req.body
            try{
                const existingUser = await emailExists(email);
                if (existingUser) return done(null, false)
                
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
                const newUser = { name, email, password: hashedPassword };

                query(`INSERT INTO users (name , email, password) VALUES ('${name}', '${email}','${hashedPassword}')`,(error, results) => {
                    if(error){
                        return done(error)
                    }
                    return done(null, newUser)
                })          
            }catch(error){
                return done(error)
            }
                    
    })
)

// Set up the Passport Login strategy:
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

