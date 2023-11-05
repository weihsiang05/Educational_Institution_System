module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }

  req.flash('error', 'Do not login yet!')
  return res.redirect('/login')
}