import * as Knex from 'knex'
import config from './config/database';
import { registerContantValueForSymbol } from '../di/di';

const knex: Knex = Knex(config)

export const KnexType = Symbol('Knex')

registerContantValueForSymbol(KnexType, knex)
