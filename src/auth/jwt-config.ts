import * as jwt from 'jsonwebtoken'
import { ExtractJwt, StrategyOptions } from "passport-jwt";
const ms = require('ms')

export const expiresIn = '60 days'

export interface JwtPayload {
  id: string
  issueDate: Date
  expiresIn: number
}

export function getJwtToken(user: { id: string }) {
  const payload: JwtPayload = { id: user.id, issueDate: new Date(), expiresIn: ms(expiresIn) }
  const token = jwt.sign(payload, jwtOptions.secretOrKey as string, { expiresIn })
  return token
}

export const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || '',
};
