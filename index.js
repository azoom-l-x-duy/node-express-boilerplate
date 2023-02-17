import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import statuses from 'statuses'
import promiseRouter from 'express-promise-router'

import nnnRouter from '@config/nnn-router.js'
import errorHandler from '@middleware/error-handler.js'

dotenv.config()

express.response.sendStatus = function (statusCode) {
  this.status(statusCode).json({
    message: statuses(statusCode) || String(statusCode),
  })
}

const app = express()

const nnnRouterOptions = {
  routeDir: '/routes',
  baseRouter: promiseRouter(),
}

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
  express.json(),
  express.urlencoded({ extended: true }),
  nnnRouter(nnnRouterOptions),
  errorHandler
)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
