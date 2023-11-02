module.exports = (req, res, next) => {
  res.locals.success_mes = req.flash('success')
  res.locals.error_mes = req.flash('error')
  next()
}