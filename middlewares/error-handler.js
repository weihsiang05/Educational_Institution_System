module.exports = (error, req, res, next) => {
  console.log(error)
  req.flash('error', error.errorMessage || 'Fail!!!')
  res.redirect('back')

  next(error)
}