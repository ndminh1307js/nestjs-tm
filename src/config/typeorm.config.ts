import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { db } from './configuration';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: db.host,
  port: db.port,
  username: db.username,
  password: db.password,
  database: db.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: db.synchronize
};
