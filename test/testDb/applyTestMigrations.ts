import { Knex } from 'knex';

export default async (connection: Knex): Promise<void> => {
  await connection.schema.createTable('user', (table) => {
    table.increments();
    table.string('name').notNullable();
    table.string('lastName').notNullable();
    table.string('address');
  });
  await connection.schema.createTable('company', (table) => {
    table.increments();
    table.string('name').notNullable();
    table.integer('ownerId').notNullable();
    table.foreign('ownerId').references('user.id');
  });
  await connection.schema.createTable('product', (table) => {
    table.increments();

    table.integer('companyId').notNullable();
    table.foreign('companyId').references('company.id');
    table.string('name').notNullable();
    table.decimal('unitPrice').notNullable();
  });

  await connection.schema.createTable('order', (table) => {
    table.increments();
    table.date('date');
    table.decimal('total');

    table.integer('buyerId').notNullable();
    table.foreign('buyerId').references('user.id');
  });
  await connection.schema.createTable('orderLine', (table) => {
    table.increments();
    table.integer('orderId').notNullable();
    table.foreign('orderId').references('order.id');
    table.float('amount');

    table.integer('productId').notNullable();
    table.foreign('productId').references('product.id');
  });
};
