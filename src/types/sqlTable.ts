import { Table } from './table';
import { SqlColumn } from './sqlColumn';
import { SqlConnection } from './connection';

export interface SqlTable {
  alias: string;
  table: Table;
  columns: SqlColumn[];
  pluralConnections: SqlConnection[];
  singularConnections: SqlConnection[];
}
