import * as passport from 'passport'
import * as FacebookTokenStrategy from 'passport-facebook-token'
import { Strategy as JwtStrategy } from 'passport-jwt';
import { fbConfig } from './fb-config';
import { Profile } from 'passport-facebook-token';
import { User, UserService } from '../api/UserService';
import { jwtOptions, JwtPayload } from './jwt-config';
import { getInstanceDI } from '../di/di';
import { Model } from '../model/model';
import { APP_NAME } from '../app-name';

const debug = require('debug')(APP_NAME + ':passport-config.ts')

const userService = getInstanceDI(UserService)
const model = getInstanceDI(Model)

export const passportConfigureStrategies = () => {
  passport.use(new FacebookTokenStrategy(
    {
      clientID: fbConfig.appId,
      clientSecret: fbConfig.appSecret
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        done(null, await upsertFbUser(accessToken, profile))
      } catch (e) {
        done(e, false)
      }
    }
  ))

  passport.use(new JwtStrategy(
    jwtOptions,
    async (jwtPayload: JwtPayload, done) => {
      try {
        done(null, (await userService.getUserForId(jwtPayload.id)) || false)
      } catch (e) {
        done(e, false)
      }
    }
  ))
}

const upsertFbUser = async (
  accessToken: string,
  profile: Profile
): Promise<User> => {
  const { id } = profile
  const user = await new model.Users({ id }).fetch()
  if (user) {
    return await userService.updateFBDataForUser(user, profile, accessToken)
  }
  // user does not exist
  return await userService.createNewFBUser(profile, accessToken)
}
