import { Knex } from 'knex';
// @ts-ignore
import { listTablesAsync } from 'knex-list-db-table';

export default async (connection: Knex): Promise<string[]> => {
  let dialect = connection.client.config.client;

  if (dialect === 'postgresql') {
    const tablesNames: string[] = await connection
      .select('datname')
      .from('pg_catalog.pg_database')
      .where('datistemplate', false)
      .where('datallowconn', true)
      .then((rst) => {
        return rst.map((it) => it.datname);
      });

    return tablesNames;
  }

  if (dialect === 'mssql') {
    const tablesNames: string[] = await connection.raw('SP_HELPDB').then((rst) => {
      return rst.map((it: any) => it.name).filter((it: any) => ['model', 'tempdb', 'master', 'msdb'].indexOf(it) < 0); //exclude system dbs
    });

    return tablesNames;
  }
  if (dialect === 'sqlite3') {
    const tablesNames: string[] = (
      await connection('sqlite_schema').where({ type: 'table' }).where('name', 'not like', 'sqlite_%')
    ).map((item) => item.name);
    return tablesNames;
  }
  throw new Error('Dialect not supported');
};
