import { SqlColumn, SqlTable } from '../types';

export default (sqlTables: SqlTable[]) => {
  sqlTables.forEach((sqlTable) => {
    sqlTable.columns.forEach((sqlColumn) => {
      sqlColumn.alias = `${sqlColumn.column.name}_of_${sqlTable.alias}`;
    });
  });
};
