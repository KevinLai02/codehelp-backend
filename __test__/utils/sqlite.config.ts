import SQLiteDB from 'better-sqlite3';
import type { DataSource } from 'typeorm';
import testDataSource from '~/db/testDataSource';

export class SQLite {
  private dataSource: DataSource;
  private sqliteDB: SQLiteDB.Database;

  async setup() {
    try {
      this.sqliteDB = new SQLiteDB(':memory:', { verbose: console.log });
      this.dataSource = testDataSource;
      await this.dataSource.initialize();
    } catch (error) {
      if (error instanceof Error) {
      }
    }
  }

  async destroy() {
    try {
      await this.dataSource.destroy();
      this.sqliteDB.close();
    } catch (error) {
      if (error instanceof Error) {
      }
    }
  }
}
