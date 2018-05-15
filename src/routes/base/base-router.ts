import { Router, Request, Response, NextFunction } from 'express';
import { Injectable } from '../../di/di';
import { injectable } from 'inversify';

@injectable()
export abstract class AbstractRouter {
  router: Router
  constructor() {
    this.router = Router()
  }
}
