import { Schema } from '../../src/types';

export const testSchema: Schema = {
  tables: [
    {
      name: 'user',
      columns: [
        {
          isId: true,
          name: 'id',
          type: 'integer',
        },
        {
          isId: false,
          name: 'name',
          type: 'varchar',
        },
        {
          isId: false,
          name: 'lastName',
          type: 'varchar',
        },
        {
          isId: false,
          name: 'address',
          type: 'varchar',
        },
      ],
      pluralConnections: [
        {
          foreignKeys: [{ table: 'company', column: 'ownerId' }],
          table: 'company',
          propName: 'ownedCompanies',
        },
        {
          foreignKeys: [{ table: 'order', column: 'buyerId' }],
          table: 'order',
          propName: 'buys',
        },
      ],
      singularConnections: [],
    },
    {
      name: 'company',
      columns: [
        {
          isId: true,
          name: 'id',
          type: 'integer',
        },
        {
          isId: false,
          name: 'name',
          type: 'varchar',
        },
        {
          isId: false,
          name: 'ownerId',
          type: 'integer',
        },
      ],
      pluralConnections: [
        {
          foreignKeys: [{ table: 'product', column: 'companyId' }],
          table: 'product',
          propName: 'products',
        },
      ],
      singularConnections: [
        {
          foreignKeys: [{ table: 'company', column: 'ownerId' }],
          table: 'user',
          propName: 'owner',
        },
      ],
    },
    {
      name: 'product',
      columns: [
        {
          isId: true,
          name: 'id',
          type: 'integer',
        },
        {
          isId: false,
          name: 'name',
          type: 'varchar',
        },
        {
          isId: false,
          name: 'companyId',
          type: 'integer',
        },
        {
          isId: false,
          name: 'unitPrice',
          type: 'float',
        },
      ],

      pluralConnections: [
        {
          foreignKeys: [{ table: 'orderLine', column: 'productId' }],
          table: 'orderLine',
          propName: 'orderLines',
        },
      ],
      singularConnections: [
        {
          foreignKeys: [{ table: 'product', column: 'companyId' }],
          table: 'company',
          propName: 'company',
        },
      ],
    },
    {
      name: 'order',
      columns: [
        {
          isId: true,
          name: 'id',
          type: 'integer',
        },
        {
          isId: false,
          name: 'date',
          type: 'date',
        },
        {
          isId: false,
          name: 'buyerId',
          type: 'integer',
        },
        {
          isId: false,
          name: 'total',
          type: 'float',
        },
      ],
      pluralConnections: [
        {
          foreignKeys: [{ table: 'orderLine', column: 'orderId' }],
          table: 'orderLine',
          propName: 'orderLines',
        },
      ],
      singularConnections: [
        {
          foreignKeys: [{ table: 'order', column: 'buyerId' }],
          table: 'user',
          propName: 'buyer',
        },
      ],
    },
    {
      name: 'orderLine',
      columns: [
        {
          isId: true,
          name: 'id',
          type: 'integer',
        },
        {
          isId: false,
          name: 'orderId',
          type: 'integer',
        },
        {
          isId: false,
          name: 'productId',
          type: 'integer',
        },
        {
          isId: false,
          name: 'amount',
          type: 'float',
        },
      ],
      pluralConnections: [],
      singularConnections: [
        {
          foreignKeys: [{ table: 'orderLine', column: 'orderId' }],
          table: 'order',
          propName: 'order',
        },
        {
          foreignKeys: [{ table: 'orderLine', column: 'productId' }],
          table: 'product',
          propName: 'product',
        },
      ],
    },
  ],
};
