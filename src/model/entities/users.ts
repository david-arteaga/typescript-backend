import { Post } from './post';
import { bookshelf } from '../bookshelf';

export class Users extends bookshelf.Model<Users> {
	get tableName() { return 'users' }
	get idAttribute() { return 'id' }

	posts() { return this.hasMany(Post)}
}

export namespace Users {
  export enum Related {
    posts = 'posts'
  }
}
