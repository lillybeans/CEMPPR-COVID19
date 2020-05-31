/** check authenticated and not authenticated **/

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/profile')
  }
  next()
}

function checkAdmin(req, res, next){
  if (req.user.user_group != "admin"){
    return res.redirect('/unauthorized')
  }
  next()
}

module.exports = {
  checkAuthenticated: checkAuthenticated,
  checkNotAuthenticated: checkNotAuthenticated,
  checkAdmin: checkAdmin
}
