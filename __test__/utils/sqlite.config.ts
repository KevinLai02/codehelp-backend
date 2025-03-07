import testDataSource from "~/db/testDataSource"
import SQLiteDB from "better-sqlite3"
import { DataSource } from "typeorm"

export class SQLite {
  private dataSource: DataSource
  private sqliteDB: SQLiteDB.Database

  async setup() {
    try {
      this.sqliteDB = new SQLiteDB(":memory:", { verbose: console.log })
      this.dataSource = testDataSource
      await this.dataSource.initialize()
      console.log("Database connection established.")
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.stack)
      }
    }
  }

  async destroy() {
    try {
      await this.dataSource.destroy()
      this.sqliteDB.close()
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.stack)
      }
    }
  }
}
