import testDb, { testSchema } from './testDb';
import deepEqual from 'deep-equal';
import { getSchemaFromDb } from '../src/getSchemaFromDb';

describe('getSchemaDromDb', () => {
  test('', async () => {
    const connection = await testDb();
    const schema = await getSchemaFromDb(connection, {
      getPropName: (table: string, foreignKey): string => {
        if (foreignKey.tableName === 'user' && foreignKey.foreignTableName === 'company') {
          if (table === 'user') {
            return 'ownedCompanies';
          }
          return 'owner';
        }
        if (foreignKey.tableName === 'user' && foreignKey.foreignTableName === 'order') {
          if (table === 'user') {
            return 'buys';
          }
          return 'buyer';
        }
        if (foreignKey.tableName === 'order' && foreignKey.foreignTableName === 'orderLine') {
          if (table === 'order') {
            return 'orderLines';
          }
          return 'order';
        }
        if (foreignKey.tableName === 'product' && foreignKey.foreignTableName === 'orderLine') {
          if (table === 'product') {
            return 'orderLines';
          }
          return 'product';
        }
        if (foreignKey.tableName === 'company' && foreignKey.foreignTableName === 'product') {
          if (table === 'product') {
            return 'company';
          }
          return 'products';
        }
        console.log(foreignKey);
        throw new Error('not implemented');
      },
    });

    for (const table of schema.tables) {
      const otherTable = testSchema.tables.find((item) => item.name === table.name);

      expect(table.columns.length).toBe(otherTable.columns.length);
      for (const column of table.columns) {
        const otherColumn = otherTable.columns.find((item) => item.name === column.name);
        expect(deepEqual(column, otherColumn)).toBe(true);
      }

      expect(table.pluralConnections.length).toBe(otherTable.pluralConnections.length);
      for (const pluralConnection of table.pluralConnections) {
        const otherPluralConnection = otherTable.pluralConnections.find(
          (item) => item.table === pluralConnection.table && item.propName === pluralConnection.propName,
        );
        expect(deepEqual(pluralConnection, otherPluralConnection)).toBe(true);
      }

      expect(table.singularConnections.length).toBe(otherTable.singularConnections.length);
      for (const singularConnection of table.singularConnections) {
        const otherSingularConnection = otherTable.singularConnections.find(
          (item) => item.table === singularConnection.table && item.propName === singularConnection.propName,
        );
        expect(deepEqual(singularConnection, otherSingularConnection)).toBe(true);
      }
    }
  });
});
