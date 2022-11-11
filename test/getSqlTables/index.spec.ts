import testDb, { testSchema } from '../testDb';
import getSqlTables from '../../src/getSqlTables';

describe('getSqlTables', () => {
  test('something', async () => {
    const connection = await testDb();
    const query = connection('product')
      .join('orderLine', 'orderLine.productId', 'product.id')
      .select('orderLine.amount', 'product.name');

    const sqlTables = getSqlTables(query, testSchema);

    console.log(JSON.stringify(sqlTables));
  });
});
