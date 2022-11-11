import getTableNameAndColumn from '../../src/getSqlTables/getTableNameAndColumn';
import { testSchema } from '../testDb/';
import { SqlColumn, SqlTable } from '../../src/types';

describe('getTableNameAndColumn', () => {
  it('should find simple column without table', () => {
    const columns = getTableNameAndColumn(
      testSchema,
      [
        {
          table: testSchema.tables.find((item) => item.name === 'product'),
          alias: 'product',
          columns: [],
          pluralConnections: [],
          singularConnections: [],
        },
      ],
      'name',
    );
    expect(columns.length).toBe(1);
    expect(columns[0].column).toBe('name');
    expect(columns[0].table).toBe('product');
  });
  it('should throw error for finding multiple columns', () => {
    expect(() =>
      getTableNameAndColumn(
        testSchema,
        [
          {
            table: testSchema.tables.find((item) => item.name === 'product'),
            alias: 'product',
            columns: [],
            pluralConnections: [],
            singularConnections: [],
          },
          {
            table: testSchema.tables.find((item) => item.name === 'company'),
            alias: 'company',
            columns: [],
            pluralConnections: [],
            singularConnections: [],
          },
        ],
        'name',
      ),
    ).toThrow();
  });
  it('should find simple column with table', () => {
    const columns = getTableNameAndColumn(
      testSchema,
      [
        {
          table: testSchema.tables.find((item) => item.name === 'product'),
          alias: 'product',
          columns: [],
          pluralConnections: [],
          singularConnections: [],
        },
        {
          table: testSchema.tables.find((item) => item.name === 'company'),
          alias: 'company',
          columns: [],
          pluralConnections: [],
          singularConnections: [],
        },
      ],
      'product.name',
    );
    expect(columns.length).toBe(1);
    expect(columns[0].column).toBe('name');
    expect(columns[0].table).toBe('product');
  });

  it('should return all fields', () => {
    const sqlTables: SqlTable[] = [
      {
        table: testSchema.tables.find((item) => item.name === 'product'),
        alias: 'product',
        columns: [],
        pluralConnections: [],
        singularConnections: [],
      },
      {
        table: testSchema.tables.find((item) => item.name === 'company'),
        alias: 'company',
        columns: [],
        pluralConnections: [],
        singularConnections: [],
      },
    ];
    const columns = getTableNameAndColumn(testSchema, sqlTables, '*');

    expect(columns.length).toBe(
      sqlTables.reduce((acc: number, item: SqlTable) => {
        return acc + item.table.columns.length;
      }, 0),
    );

    sqlTables.forEach((sqlTable) => {
      sqlTable.table.columns.forEach((column) => {
        const col = columns.find((item) => item.table === sqlTable.alias && item.column === column.name);
        expect(col!.column).toBe(column.name);
        expect(col!.table).toBe(sqlTable.alias);
      });
    });
  });

  it('should return all fields of a table', () => {
    const sqlTables: SqlTable[] = [
      {
        table: testSchema.tables.find((item) => item.name === 'product'),
        alias: 'product',
        columns: [],
        pluralConnections: [],
        singularConnections: [],
      },
      {
        table: testSchema.tables.find((item) => item.name === 'company'),
        alias: 'company',
        columns: [],
        pluralConnections: [],
        singularConnections: [],
      },
    ];
    const columns = getTableNameAndColumn(testSchema, sqlTables, 'product.*');

    const sqlTable = sqlTables[0];
    expect(columns.length).toBe(sqlTable.table.columns.length);

    sqlTable.columns.forEach((column) => {
      const col = columns.find((item) => item.table === sqlTable.alias && item.column === column.column.name);
      expect(col!.column).toBe(column.column.name);
      expect(col!.table).toBe(sqlTable.alias);
    });
  });
});
