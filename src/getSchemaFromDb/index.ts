import { Knex } from 'knex';
import { Schema } from '../types';
import getTables from './getTables';
import getColumns from './getColumns';
import getPrimaryKeys from './getPrimaryKeys';
import getForeignKeys from './getForeignKeys';
import getTableNameAndColumn from '../getSqlTables/getTableNameAndColumn';

export const getSchemaFromDb = async (
  connection: Knex,
  options: {
    getPropName: (
      table: string,
      input: {
        tableName: string;
        columnName: string;
        foreignTableName: string;
        foreignColumnName: string;
      },
    ) => string;
  },
): Promise<Schema> => {
  const tables = await getTables(connection);

  const schema: Schema = {
    tables: [],
  };

  for (const table of tables) {
    const columns = await getColumns(table, connection);
    const keys = await getPrimaryKeys(table, connection);

    keys.forEach((key) => {
      columns.find((item) => item.name == key)!.isId = true;
    });
    schema.tables.push({
      columns,
      name: table,
      singularConnections: [],
      pluralConnections: [],
    });
  }
  const foreignKeys = await getForeignKeys(tables, connection);
  for (const foreignKey of foreignKeys) {
    //TODO implement one to one relation
    const oneSide = schema.tables.find((item) => item.name === foreignKey.tableName)!;
    const manySide = schema.tables.find((item) => item.name === foreignKey.foreignTableName)!;
    oneSide.pluralConnections.push({
      table: foreignKey.foreignTableName,
      foreignKeys: [{ table: foreignKey.foreignTableName, column: foreignKey.foreignColumnName }],
      propName: options.getPropName(foreignKey.tableName, foreignKey),
    });
    manySide.singularConnections.push({
      table: foreignKey.tableName,
      foreignKeys: [{ table: foreignKey.foreignTableName, column: foreignKey.foreignColumnName }],
      propName: options.getPropName(foreignKey.foreignTableName, foreignKey),
    });
  }

  return schema;
};
