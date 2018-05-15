import * as Knex from 'knex'

export function up(knex: Knex, Promise: PromiseConstructor) {

  const schema = knex.schema
    .createTable('users', table => {
      table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('firstname').notNullable()
      table.string('lastname').notNullable()
      table.string('email').notNullable()
      table.string('fb_token').nullable()
      table.jsonb('fb_data').nullable()
      table.string('password').nullable()
    })
  
  return schema
}

export function down(knex: Knex, Promise: PromiseConstructor) {
  return knex.schema
    .dropTableIfExists('users')
}
