import * as passport from 'passport'
import { AbstractRouter } from './base/base-router';
import { getJwtToken } from '../auth/jwt-config';
import { User, CreatePlainUserData, UserService } from '../api/UserService';
import { Request, Response, NextFunction } from 'express';
import { catch_async, isValidEmail, validateRequiredFields } from './base/util';
import { Injectable, Inject } from '../di/di';
import { APP_NAME } from '../app-name';

const debug = require('debug')(APP_NAME + ':AuthRouter')

/**
 * #baseRoute: /api/auth
 * Initialize the router for api calls
 */
@Injectable()
export class AuthRouter extends AbstractRouter {

  constructor(
    @Inject(UserService) private userService: UserService,
  ) {
    super()
    // /facebook expects a body with the following type: { access_token: string }
    this.router.post('/facebook',
      passport.authenticate('facebook-token', { session: false }),
      this.getTokenForAuthenticatedUserRequest
    )

    this.router.post('/userpass/register',
      catch_async(this.register),
      this.getTokenForAuthenticatedUserRequest,
    )
    
    this.router.post('/userpass/login',
      catch_async(this.login),
      this.getTokenForAuthenticatedUserRequest,
    )

    this.router.get('/refresh_token',
      authenticateRequest,
      catch_async(this.getTokenForAuthenticatedUserRequest)
    )
  }

  validateRegisterBody = (body: any) => {
    const userToCreate = body.user
    if (!userToCreate) {
      return { error: 'body must have a user field' }
    }
    const validationErrors = validateRequiredFields(userToCreate, CreatePlainUserData.keys)
    if (validationErrors) {
      return {
        error: validationErrors
      }
    }
    if (!isValidEmail(userToCreate.email)) {
      return { error: 'email' }
    }
    return {
      user: userToCreate as CreatePlainUserData
    }
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    const { error: validationErrors , user: userToCreate } = this.validateRegisterBody(req.body)
    if (validationErrors) {
      return res.status(400).json({ error: validationErrors })
    }

    const { user, error } = await this.userService.createNewPlainUser(userToCreate!)
    
    if (error) {
      return res.status(403).json({ error })
    }
    
    debug('Created user ', user)
    req.user = user
    return next()
  }

  validateLoginBody = (body: any) => {
    const user = body.user
    if (!user) {
      return {
        error: 'body must have user field'
      }
    }
    const validationErrors = validateRequiredFields(user, ['id', 'password'])
    if (validationErrors) {
      return {
        error: validationErrors
      }
    }

    return { user: user as { id: string, password: string }}
  }
  
  login = async (req: Request, res: Response, next: NextFunction) => {
    const { error: validationErrors, user } = this.validateLoginBody(req.body)
    
    if (validationErrors) {
      return res.status(400).json({ error: validationErrors })
    }
    const { id, password } = user!
    const { error, user: authedUser } = await this.userService.authenticatePlainUser(id, password)
    if (error) {
      return res.status(403).json({ error })
    }

    req.user = authedUser
    return next()
  }

  getTokenForAuthenticatedUserRequest = async (req: Request, res: Response) => {
    const jwtToken = getJwtToken(req.user as User)
    res.setHeader('Authorization', `Bearer ${jwtToken}`)
    res.json({
      jwtToken,
      user: req.user
    } as AuthResponse)
  }
}

export const authenticateRequest = passport.authenticate('jwt', { session: false })

export interface AuthResponse {
  jwtToken: string
  user: User
}
