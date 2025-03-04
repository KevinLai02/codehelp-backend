import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm"
import { ColumnTypeAdapter } from "../utils/ColumnTypeAdapter"

@Entity("migrations", { schema: "public" })
export class Migrations extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number

  @ColumnTypeAdapter("bigint", { name: "timestamp" })
  timestamp: string

  @ColumnTypeAdapter("character varying", { name: "name" })
  name: string
}
