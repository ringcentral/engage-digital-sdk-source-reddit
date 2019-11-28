
import express from 'express'
import bodyParser from 'body-parser'
import viewIndex from './routes/view-index'
import { initDb, viewDb } from './routes/admin'
import oauth from './routes/oauth'
import logout from './routes/logout'
import api from './routes/api'
import morgan from 'morgan'
import { resolve } from 'path'
import basicAuth from 'express-basic-auth'
import jwt from 'express-jwt'
import onRequestInit from 'ringcentral-engage-source/dist/handlers/on-request'
import verifyId from './handlers/verify-id'

export default (app, onRequest) => {
  const jwtAuth = jwt({
    secret: process.env.SERVER_SECRET
  })
  const {
    RINGCENTRAL_ADMIN_USERNAME,
    RINGCENTRAL_ADMIN_PASSWORD,
    APP_HOME = '/',
    SERVER_HOME = '/:id'
  } = process.env
  const auth = basicAuth({
    users: {
      [RINGCENTRAL_ADMIN_USERNAME]: RINGCENTRAL_ADMIN_PASSWORD
    }
  })

  const staticPath = resolve(__dirname, '../dist/static')

  app.use(express.static(staticPath))
  app.use(morgan('tiny'))
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.set('views', resolve(__dirname, '../views'))
  app.set('view engine', 'pug')

  app.get('/logout', logout)
  app.get('/test', (req, res) => res.send('server running'))
  app.get('/rc/oauth', oauth)
  app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('invalid token...')
    } else {
      next()
    }
  })
  app.post('/api/action', jwtAuth, api)
  app.put('/admin/setup-database', auth, initDb)
  app.get('/admin/view-database', auth, viewDb)

  app.get(APP_HOME, viewIndex)
  app.post(
    SERVER_HOME,
    verifyId,
    onRequestInit({ onRequest })
  )
  return app
}
