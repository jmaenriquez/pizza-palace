import type { Columns, Row } from "./Fields";

export const emptyRow = (columns: Columns[]): Row =>
  Object.fromEntries(columns.map((col) => [col.name, ""]));