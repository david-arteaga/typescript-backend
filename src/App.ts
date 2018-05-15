import * as path from 'path'
import * as express from 'express'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'
import * as passport from 'passport'
import * as cors from 'cors'

import { getInstanceDI, Inject, Injectable } from './di/di'
import { ApiRouter } from './routes/ApiRouter'
import { AuthRouter, authenticateRequest } from './routes/AuthRouter'
import { APP_NAME } from './app-name';
import { passportConfigureStrategies } from './auth/passport-config';

const debug = require('debug')(APP_NAME + ':App.ts')

@Injectable()
export class App {

  express: express.Application

  constructor(
    @Inject(ApiRouter) private apiRouter: ApiRouter,
    @Inject(AuthRouter) private authRouter: AuthRouter,
  ) {
    this.express = express()
    this.middleware()
    this.configurePassport()
    this.routes()
  }

  private configurePassport = () => {
    passportConfigureStrategies()
    this.express.use(passport.initialize())
  }

  private middleware(): void {
    this.express.use(cors())
    this.express.use(logger('dev'))
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: true }))
  }

  private routes(): void {
    this.express.use('/api/auth', this.authRouter.router)
    this.express.use('/api', authenticateRequest, this.apiRouter.router)
  }

}
