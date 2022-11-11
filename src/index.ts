import { Schema } from './types';
import { Knex } from 'knex';
import getSqlTables from './getSqlTables';
import nest from './nest';
export * from './getSchemaFromDb';

export default async <T>(query: Knex.QueryBuilder, schema: Schema): Promise<T[]> => {
  const clonedQuery = query.clone();

  const sqlTables = getSqlTables(clonedQuery, schema);

  const sqlColumns: string[] = [];
  sqlTables.forEach((sqlTable) => {
    sqlTable.columns.forEach((sqlColumn) => {
      sqlColumns.push(`${sqlTable.alias}.${sqlColumn.column.name} as ${sqlColumn.alias}`);
    });
  });
  clonedQuery.clearSelect();
  clonedQuery.select(sqlColumns);

  const result = await clonedQuery;
  // @ts-ignore
  const { table } = query._single;

  return nest(result, table, sqlTables);
};
