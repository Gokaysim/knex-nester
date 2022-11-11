import { Knex } from 'knex';
import { Schema, SqlTable, Table } from '../types';
import setColumns from './setColumns';
import setColumnAliases from './setColumnAliases';
import setConnections from './setConnections';
import getJoinDetails from './getJoinDetails';

const joinCallback = (schema: Schema, sqlTables: SqlTable[]) => (join: any) => {
  const { leftTable, rightTableAlias, rightTable } = getJoinDetails(join);
  const rightTableSchema: Table | undefined = schema.tables.find((item) => item.name === rightTable);
  const leftTableSql: SqlTable | undefined = sqlTables.find((item) => item.table.name === leftTable);

  if (!rightTableSchema) {
    throw new Error(`${rightTable} table doesn't exist in schema`);
  }
  if (!leftTableSql) {
    throw new Error(`${leftTable} table didn't included`);
  }
  const foundPluralConnections = leftTableSql.table.pluralConnections.filter(
    (connection) => connection.table === rightTable,
  );
  const foundSingularConnections = leftTableSql.table.singularConnections.filter(
    (connection) => connection.table === rightTable,
  );
  const totalConnectionCount = foundPluralConnections.length + foundSingularConnections.length;
  if (totalConnectionCount === 0) {
    throw new Error(`No connection found for ${leftTable} and ${rightTable}`);
  }
  if (totalConnectionCount > 1) {
    //TODO use options to resolve
    throw new Error(
      `More than one connection found for ${leftTable} and ${rightTable}. Correct resolution need to be supplied`,
    );
  }
  if (foundPluralConnections.length > 0) {
    leftTableSql.pluralConnections.push({
      alias: rightTableAlias,
      connection: foundPluralConnections[0],
    });
  } else if (foundSingularConnections.length > 0) {
    leftTableSql.singularConnections.push({
      alias: rightTableAlias,
      connection: foundSingularConnections[0],
    });
  }

  sqlTables.push({
    table: rightTableSchema,
    alias: rightTableAlias,
    columns: [],
    pluralConnections: [],
    singularConnections: [],
  });
};
export default (knexQuery: Knex.QueryBuilder, schema: Schema): SqlTable[] => {
  const sqlTables: SqlTable[] = [];
  // @ts-ignore
  const { table } = knexQuery._single;
  const aliasTable = table.includes(' as ') ? table.split(' as ')[1].trim() : table;
  const sqlTable = table.includes(' as ') ? table.split(' as ')[0].trim() : table;
  const mainTable: Table | undefined = schema.tables.find((item) => item.name === sqlTable);

  if (!mainTable) {
    throw new Error(`${sqlTable} table doesn't exist in schema`);
  }
  sqlTables.push({
    table: mainTable,
    alias: aliasTable,
    columns: [],
    pluralConnections: [],
    singularConnections: [],
  });

  // eslint-disable-next-line no-underscore-dangle,@typescript-eslint/ban-ts-comment
  // @ts-ignore
  const joins = knexQuery._statements.filter((statement: any) => statement.joinType);

  joins.forEach(joinCallback(schema, sqlTables));

  setColumns(knexQuery, schema, sqlTables);
  setColumnAliases(sqlTables);
  return sqlTables;
};
