import * as Knex from 'knex'

export const seedsConfig: Knex.SeedsConfig = {
  directory: './dist/model/migrations/seeds',
}

export default seedsConfig
