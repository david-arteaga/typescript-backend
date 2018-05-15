import { Router, Request, Response, NextFunction } from 'express';
import { AbstractRouter } from "./base/base-router";
import { catch_async } from './base/util';
import { Injectable, Inject, getInstanceDI, getInstanceForSymbol } from '../di/di';
import { UserService } from '../api/UserService';
import * as Bookshelf from 'bookshelf';
import { BookshelfType } from '../model/bookshelf';
import { inject, injectable, Container } from 'inversify';
import { Users } from '../model/entities/users';
import { Post } from '../model/entities/post';
import { APP_NAME } from '../app-name';
import { AuthResponse } from './AuthRouter';

const debug = require('debug')(APP_NAME + ':ApiRouter')

@Injectable()
export class ApiRouter extends AbstractRouter {

  constructor(
  ) {
    super()
    this.router.get('/user', (req, res) => {
      res.json({ user: req.user })
    })
  }

}

const aas: AuthResponse = {} as any
