import { Column, ColumnOptions, ColumnType } from "typeorm"

export function ColumnTypeAdapter(
  type: ColumnType,
  options?: ColumnOptions,
): PropertyDecorator {
  let newType = type

  if (process.env.NODE_ENV === "test") {
    switch (type) {
      case "smallint":
        newType = "integer"
        break
      case "bigint":
        newType = "integer"
        break
      case "character":
        newType = "varchar"
        break
      case "character varying":
        newType = "varchar"
        break
      case "jsonb":
        newType = "text"
        break
      case "enum":
        newType = "text"
        break
    }
  }

  return Column({ ...options, type: newType })
}
