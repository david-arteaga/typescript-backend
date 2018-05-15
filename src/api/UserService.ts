import { BaseService } from "./base/base-service";
import { Users } from "../model/entities/users";
import * as Bookshelf from 'bookshelf'
import { Injectable } from "../di/di";
import { Profile as FacebookProfile } from 'passport-facebook-token';
import { APP_NAME } from "../app-name";
import * as bcrypt from 'bcryptjs';

const debug = require('debug')(APP_NAME + ':UserService')
const passwordSaltLengthForHash = 10

@Injectable()
export class UserService extends BaseService {
  async getUserForId(id: string): Promise<User | null> {
    const user = await new this.model.Users({ id }).fetch()
    return user ? user.toJSON() as User : null
  }

  async updateFBDataForUser(user: Users, profile: FacebookProfile, fb_token: string) {
    const { id, name, emails, photos } = profile
    const toUpdate: CreateFbUserData = {
      id,
      firstname: name.givenName,
      lastname: name.familyName,
      email: (emails[0] || {}).value || '',
      fb_token,
      fb_data: profile
    }
    
    return (await user.save(toUpdate, { patch: true })).toJSON() as User
  }

  async createNewFBUser(profile: FacebookProfile, fb_token: string) {
    const { id, name, emails, photos } = profile
    const newUser: CreateFbUserData = {
      id,
      firstname: name.givenName,
      lastname: name.familyName,
      email: (emails[0] || {}).value || '',
      fb_token,
      fb_data: profile
    }
  
    // create new user
    await new this.model.Users().save(newUser)
  
    return newUser as User
  }

  async createNewPlainUser(user: CreatePlainUserData) {
    const { firstname, lastname, email, password: plainPassword } = user

    const previousUser = await new this.model.Users().where({ email }).fetch()
    debug('This is the previousUser ', previousUser)
    if (previousUser !== null) {
      return { error: 'email_exists' }
    }

    debug('about to hash pass')
    const password = await bcrypt.hash(plainPassword, passwordSaltLengthForHash)
    debug('hased password', password)
    const newUser: CreatePlainUserData = {
      firstname,
      lastname,
      email,
      password,
    }

    debug('user to create', newUser)

    return {
      user: (await new this.model.Users().save(newUser)).toJSON() as User
    }
  }

  async authenticatePlainUser(id: string, plainPassword: string) {
    const dbuser = await new this.model.Users({ id }).fetch()
    debug('This is the dbUser', dbuser)
    if (dbuser === null) {
      return {
        error: PlainUserAuthError.no_user
      }
    }

    const user = dbuser.toJSON() as User
    if (!user.password) {
      return {
        error: PlainUserAuthError.no_pass
      }
    }

    const authenticated = await bcrypt.compare(plainPassword, user.password)
    if (!authenticated) {
      return {
        error: PlainUserAuthError.wrong_pass
      }
    }

    return {
      user
    }
  }

}

const enum PlainUserAuthError {
  no_user = 'no_user',
  no_pass = 'no_pass',
  wrong_pass = 'wrong_pass',
}

export interface CreatePlainUserData {
  firstname: string
  lastname: string
  email: string
  password: string
}
export namespace CreatePlainUserData {
  export const keys = [
    'firstname',
    'lastname',
    'email',
    'password'
  ]
}

export interface CreateFbUserData {
  id: string
  firstname: string
  lastname: string
  email: string
  fb_token: string
  fb_data: any
}

export interface User {
  id: string
  firstname: string
  lastname: string
  email: string
  fb_token?: string
  fb_data?: any
  password?: string
}
