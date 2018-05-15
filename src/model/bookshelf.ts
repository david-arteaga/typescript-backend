import * as Bookshelf from 'bookshelf'
import { getInstanceForSymbol, registerContantValueForSymbol } from '../di/di';
import * as Knex from 'knex';
import { KnexType } from './knex';

const knex = getInstanceForSymbol<Knex>(KnexType)
export const bookshelf = Bookshelf(knex)
bookshelf.plugin('registry');
bookshelf.plugin('pagination');
bookshelf.plugin(require('bookshelf-cascade-delete'));

export const BookshelfType = Symbol('Bookshelf')
registerContantValueForSymbol(BookshelfType, bookshelf)
