import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '@6991hniM',
  database: 'tasksmanagement',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true
};
