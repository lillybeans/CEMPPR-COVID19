const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const connection = require("./connection")

function initialize(passport) {
  //For login
  const authenticateUser = async (email, password, done) => {
    connection.query("SELECT * FROM Users WHERE `email` = '" + email + "'", function(err, rows) {
      if (err)
        return done(err)

      if (!rows.length) {
        return done(null, false, {
          message: 'No user found'
        })
      }

      const user = rows[0]

      try {
        if (bcrypt.compareSync(password, user.password)) {
          return done(null, user)
        } else {
          return done(null, false, {
            message: 'Password is incorrect'
          })
        }
      } catch (e) {
        return done(e)
      }
    })
  }

  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, authenticateUser))

  passport.serializeUser((user, done) => done(null, user.id))

  passport.deserializeUser((id, done) => {
    connection.query("SELECT * FROM USERS WHERE id = " + id, function(err, rows) {
      done(err, rows[0]);
    })
  })

}

module.exports = initialize
