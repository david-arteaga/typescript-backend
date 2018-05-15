const APP_NAME = require('./package.json').name
module.exports = {
  apps : [{
    name   : APP_NAME,
    script : "dist/index.js",
    env: {
      "JWT_SECRET": "put a real secret here",

      "FACEBOOK_APP_ID": "ha",
      "FACEBOOK_APP_SECRET": "ha",

      "DEBUG": APP_NAME + ":*",
      APP_NAME,

      "DB_HOST": "127.0.0.1",
      "DB_NAME": "",
      "DB_USER": "",
      "DB_PASS": "",

      "DEBUG_KNEX": true,
      "INIT_DB": false,

      watch: true,
    },
    // env_production: {
    //   NODE_ENV: 'production',
    //   "DEBUG": APP_NAME + ":*",
    //   APP_NAME,
    // },
  }]
}
