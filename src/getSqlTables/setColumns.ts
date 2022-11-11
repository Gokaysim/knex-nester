import { Schema, SqlTable } from '../types';
import knex, { Knex } from 'knex';
import getTableNameAndColumn from './getTableNameAndColumn';

export default (knexQuery: Knex.QueryBuilder, schema: Schema, sqlTables: SqlTable[]): void => {
  // @ts-ignore
  let columnsStatement: { grouping: string; value: Array<string | null> } = knexQuery._statements.find(
    (statement: any) => statement.grouping === 'columns',
  );
  if (!columnsStatement) {
    knexQuery.select('*');
    // @ts-ignore
    columnsStatement = knexQuery._statements.find((statement: any) => statement.grouping === 'columns');
  }
  let columns: { table: string; column: string }[] = [];

  for (const column of columnsStatement.value) {
    if (column) {
      columns.push(...getTableNameAndColumn(schema, sqlTables, column));
    }
  }

  columns = columns.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });

  columns.forEach((column) => {
    const sqlTable = sqlTables.find((sqlTable) => sqlTable.alias === column.table);
    if (!sqlTable) {
      throw new Error(`table not exists ${column.table}`);
    }
    const columnObject = sqlTable.table.columns.find((col) => col.name === column.column);
    if (!columnObject) {
      throw new Error(`column not exists ${column.column}`);
    }
    sqlTable.columns.push({
      alias: '',
      column: columnObject,
    });
  });
};
