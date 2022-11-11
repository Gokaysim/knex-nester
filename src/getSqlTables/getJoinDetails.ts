import { Knex } from 'knex';

interface JoinClause {
  table: string;
  joinType: string;
  clauses: { column: string; value: string }[];
}
export interface JoinDetails {
  // table which is already includes
  leftTable: string;
  // table which is to be included
  rightTable: string;
  rightTableAlias: string;
}
export default (join: JoinClause): JoinDetails => {
  const aliasTable = join.table.includes(' as ') ? join.table.split(' as ')[1].trim() : join.table;
  const sqlTable = join.table.includes(' as ') ? join.table.split(' as ')[0].trim() : join.table;

  const tables = join.clauses
    .map((clause) => {
      return [clause.column.split('.')[0], clause.value.split('.')[0]];
    })
    .flat();

  const leftTable = tables.find((table) => table !== aliasTable);

  if (!leftTable) {
    throw new Error(`${aliasTable} does not exists`);
  }

  return {
    rightTable: sqlTable,
    rightTableAlias: aliasTable,
    leftTable: leftTable,
  };
};
