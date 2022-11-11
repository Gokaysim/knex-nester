import { Schema, SqlColumn, SqlTable } from '../types';

export default (schema: Schema, sqlTables: SqlTable[], column: string): { table: string; column: string }[] => {
  const [split1, split2] = column.split(' as ');
  const columnAndTable = split2 || split1;

  const columnAndTableSplit = columnAndTable.split('.');

  const columnStr = columnAndTableSplit.length == 1 ? columnAndTableSplit[0] : columnAndTableSplit[1];
  const tableStr = columnAndTableSplit.length == 1 ? '' : columnAndTableSplit[0];

  const columns: { table: string; column: string }[] = [];
  if (tableStr) {
    const sqlTable = sqlTables.find((item) => item.alias === tableStr);
    if (!sqlTable) {
      throw new Error(`${tableStr} table doesn't exists`);
    }
    if (columnStr === '*') {
      sqlTable.table.columns.forEach((item) => {
        columns.push({ table: tableStr, column: item.name });
      });
    } else {
      const column = sqlTable.table.columns.find((item) => item.name === columnStr);
      if (!column) {
        throw new Error(`${columnStr} field in ${sqlTable.table} not found`);
      }
      columns.push({ table: sqlTable.alias, column: column.name });
    }
  } else if (columnStr === '*') {
    sqlTables.forEach((sqlTable) => {
      sqlTable.table.columns.map((column) => {
        columns.push({ table: sqlTable.alias, column: column.name });
      });
    });
  } else {
    const founds: { table: string; column: string }[] = [];

    sqlTables.forEach((sqlTable) => {
      sqlTable.table.columns.map((column) => {
        if (column.name === columnStr) {
          founds.push({ table: sqlTable.alias, column: column.name });
        }
      });
    });

    if (founds.length === 0) {
      throw new Error(`no column found for ${columnStr}`);
    } else if (founds.length !== 1) {
      throw new Error(`multiple columns found in ${founds.map((item) => item.table).join(',')}`);
    }
    columns.push({ table: founds[0].table, column: founds[0].column });
  }

  return columns;
};
