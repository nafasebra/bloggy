import { DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { PostView } from '../posts/entities/post-view.entity';
import { PostLike } from '../posts/entities/post-like.entity';
import { Comment } from '../comments/entities/comment.entity';
import { CommentLike } from '../comments/entities/comment-like.entity';
import { Follow } from '../follow/entities/follow.entity';
import { Notification } from '../notifications/entities/notification.entity';

export function databaseOptions(url: string): DataSourceOptions {
  if (!/^postgres(?:ql)?:\/\//.test(url))
    throw new Error('DATABASE_URL must be a PostgreSQL connection URL');
  const schema = process.env.DATABASE_SCHEMA || 'public';
  if (!/^[a-z_][a-z0-9_]*$/.test(schema))
    throw new Error('Invalid DATABASE_SCHEMA');
  return {
    type: 'postgres',
    url,
    schema,
    extra: { options: '-c search_path=' + schema },
    entities: [
      User,
      Post,
      PostView,
      PostLike,
      Comment,
      CommentLike,
      Follow,
      Notification,
    ],
    migrations: [join(__dirname, 'migrations', '[0-9]*-*.{ts,js}')],
    synchronize: false,
    migrationsRun: true,
    uuidExtension: 'pgcrypto',
  };
}
