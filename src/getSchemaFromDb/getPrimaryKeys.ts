import { Knex } from 'knex';
// @ts-ignore
import { listTablesAsync } from 'knex-list-db-table';

export default async (table: string, connection: Knex): Promise<string[]> => {
  let dialect = connection.client.config.client;

  if (dialect === 'postgresql') {
    const { rows } = await connection.raw(`SELECT               
  pg_attribute.attname as primaryKey
FROM pg_index, pg_class, pg_attribute, pg_namespace 
WHERE 
  pg_class.oid = '${table}'::regclass AND
  indrelid = pg_class.oid AND
  nspname = 'public' AND
  pg_class.relnamespace = pg_namespace.oid AND 
  pg_attribute.attrelid = pg_class.oid AND 
  pg_attribute.attnum = any(pg_index.indkey)
 AND indisprimary`);

    return rows.map((item: any) => item.primaryKey);
  }

  if (dialect === 'mssql') {
    const { rows } = await connection.raw(`SELECT kcu.column_name  as primaryKey
  FROM   information_schema.table_constraints tc
  INNER JOIN information_schema.key_column_usage kcu
  ON     tc.CONSTRAINT_CATALOG = kcu.CONSTRAINT_CATALOG
  AND    tc.CONSTRAINT_SCHEMA = kcu.CONSTRAINT_SCHEMA
  AND    tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
  WHERE  tc.table_schema = schema()             -- only look in the current schema
  AND    tc.constraint_type = 'PRIMARY KEY'
  AND    tc.table_name = '${table}'    -- specify your table.
      ORDER BY kcu.ordinal_position`);

    return rows.map((item: any) => item.primaryKey);
  }
  if (dialect === 'sqlite3') {
    const rows = await connection.raw(`SELECT l.name FROM pragma_table_info("${table}") as l WHERE l.pk = 1;`);

    return rows.map((item: any) => item.name);
  }
  throw new Error('Dialect not supported');
};
