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
  if (req.isAuthenticated() && req.user.user_group == "admin"){
    next()
  } else {
    return res.redirect('/unauthorized')
  }
}

function checkAccountApproved(req, res, next){
  if (req.isAuthenticated() && req.user.approved){
    next()
  } else {
    return res.redirect('/unauthorized')
  }
}

module.exports = {
  checkAuthenticated: checkAuthenticated,
  checkNotAuthenticated: checkNotAuthenticated,
  checkAdmin: checkAdmin,
  checkAccountApproved: checkAccountApproved
}
