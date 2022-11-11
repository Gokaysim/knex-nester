import knexNester from '../src';
import testDb, { testSchema } from './testDb';
import { Knex } from 'knex';
import { Product } from './testDb/types';
describe('knexNester', () => {
  test('simple test', async () => {
    const connection = await testDb();
    const query = connection('product')
      .join('orderLine', 'orderLine.productId', 'product.id')
      .join('order', 'order.id', 'orderLine.orderId')
      .join('user', 'user.id', 'order.buyerId')
      .join('company', 'company.id', 'product.companyId')
      .join('company as company2', 'company2.ownerId', 'user.id')
      .join('user as user2', 'user2.id', 'company.ownerId')
      .select('product.*');

    const result: Product[] = await knexNester(query, testSchema);

    expect(result[0].name).toBeTruthy();
    expect(result[0].company).toBeTruthy();
    expect(result[0].company.owner).toBeTruthy();
    expect(result[0].orderLines).toBeTruthy();
    expect(result[0].orderLines[0].order).toBeTruthy();
    expect(result[0].orderLines[0].order.buyer).toBeTruthy();
    expect(result[0].orderLines[0].order.buyer.ownedCompanies).toBeTruthy();
  });
});
