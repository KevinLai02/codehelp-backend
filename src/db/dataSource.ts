import 'dotenv/config';
import path from 'node:path';
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  synchronize: false,
  entities: [path.join(__dirname, '/entities/*{.ts,.js}')],
  migrations: [path.join(__dirname, '/migrations/*{.ts,.js}')],
  migrationsRun: true,
  extra: {
    max: 1,
  },
});

export default dataSource;
