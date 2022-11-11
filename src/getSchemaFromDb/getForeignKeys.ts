import { Knex } from 'knex';

interface ForeignKeyMap {
  tableName: string;
  columnName: string;
  foreignTableName: string;
  foreignColumnName: string;
}
export default async (tables: string[], connection: Knex): Promise<ForeignKeyMap[]> => {
  let dialect = connection.client.config.client;

  if (dialect === 'postgresql') {
    const { rows } = await connection.raw(`SELECT
    tc.table_name as tableName,
    kcu.column_name as columnName,
    ccu.table_name AS foreignTableName,
    ccu.column_name AS foreignColumnName
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'`);
    return rows;
  }

  if (dialect === 'sqlite3') {
    const foreignKeys: ForeignKeyMap[] = [];
    for (const table of tables) {
      const results: { table: string; from: string; to: string }[] = await connection.raw(
        `PRAGMA foreign_key_list('${table}');`,
      );
      foreignKeys.push(
        ...results.map((result) => {
          return {
            tableName: result.table,
            columnName: result.to,
            foreignColumnName: result.from,
            foreignTableName: table,
          };
        }),
      );
    }
    return foreignKeys;
  }
  throw new Error('Dialect not supported');
};
