import { Knex } from 'knex';
import { Company, Order, OrderLine, Product, User } from './types';

export default async (connection: Knex): Promise<void> => {
  await connection<User>('user').insert([
    {
      name: 'Nar Toe',
      lastName: 'Spear',
      address: 'High Rock',
    },
    {
      name: 'Viaandial',
      lastName: 'Lorefhaer',
      address: 'Morrowind',
    },
    {
      name: 'Mogh',
      lastName: "Zan'nir",
      address: 'Skyrim',
    },
  ]);
  await connection<Company>('company').insert([
    {
      name: 'company1',
      ownerId: 1,
    },
    {
      name: 'company2',
      ownerId: 2,
    },
  ]);
  await connection<Product>('product').insert([
    {
      companyId: 1,
      name: 'company1_product1',
      unitPrice: 10,
    },
    {
      companyId: 1,
      name: 'company1_product2',
      unitPrice: 20,
    },
    {
      companyId: 2,
      name: 'company2_product1',
      unitPrice: 100,
    },
    {
      companyId: 2,
      name: 'company2_product2',
      unitPrice: 200,
    },
    {
      companyId: 2,
      name: 'company2_product3',
      unitPrice: 300,
    },
  ]);

  await connection<Order>('order').insert([
    {
      buyerId: 1,
      date: '2022-09-01',
      total: 100,
    },
    {
      buyerId: 2,
      date: '2022-10-01',
      total: 100,
    },
    {
      buyerId: 3,
      date: '2022-11-01',
      total: 100,
    },
  ]);
  await connection<OrderLine>('orderLine').insert([
    { orderId: 1, productId: 1, amount: 2 },
    { orderId: 1, productId: 3, amount: 1 },
    { orderId: 2, productId: 2, amount: 2 },
    { orderId: 3, productId: 4, amount: 3 },
    { orderId: 3, productId: 5, amount: 2 },
  ]);
};
