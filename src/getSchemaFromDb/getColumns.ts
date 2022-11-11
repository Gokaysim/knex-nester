import { Knex } from 'knex';
import { Column } from '../types';

export default async (table: string, connection: Knex): Promise<Column[]> => {
  const columns = await connection(table).columnInfo();
  return Object.keys(columns).map((key) => {
    return {
      isId: false,
      name: key,
      type: columns[key].type,
    };
  });
};
