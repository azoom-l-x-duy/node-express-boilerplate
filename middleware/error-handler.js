export default (error, req, res, next) => {
  console.error(error)

  return res.sendStatus(error.status || 500)
}
