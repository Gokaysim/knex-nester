import knex, { Knex } from 'knex';
import applyTestMigrations from './applyTestMigrations';
import insertDummyData from './insertDummyData';
export * from './schema';

export default async (): Promise<Knex> => {
  const connection = await knex({
    client: 'sqlite3',
    connection: {
      filename: ':memory:',
    },
    useNullAsDefault: true,
  });

  await applyTestMigrations(connection);
  await insertDummyData(connection);

  return connection;
};
