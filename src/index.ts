import { install } from 'source-map-support'
import "reflect-metadata";
import * as http from 'http';
import { getInstanceDI } from './di/di';
import { App } from './App';
import { Model } from './model/model';
import { APP_NAME } from './app-name';
install()

const debug = require('debug')(APP_NAME + ':index.ts');

debug('Initializing application...')
const app = getInstanceDI(App).express
debug('Application initialized')

const model = getInstanceDI(Model)
model.init()
  .then(() => debug("Model initialized"))
  .catch(e => debug("Model could not be initialized", e))

const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: number|string): number|string|boolean {
  let port = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(port)) {
    return val;
  } else if (port >= 0) {
    return port;
  } else {
    return false;
  }
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;
  let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
  switch(error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  let addr = server.address();
  let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}
