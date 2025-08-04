import path from 'node:path';
import { DataSource } from 'typeorm';

const testDataSource = new DataSource({
  type: 'better-sqlite3',
  database: ':memory:',
  synchronize: true,
  entities: [path.join(__dirname, '/entities/*{.ts,.js}')],
});

export default testDataSource;
