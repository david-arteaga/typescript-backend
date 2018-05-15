import * as Knex from 'knex'

export const migrationsConfig: Knex.MigratorConfig = {
  directory: './dist/model/migrations',
  tableName: 'migrations',
}

export default migrationsConfig
