import setColumnAliases from '../../src/getSqlTables/setColumnAliases';
import { SqlTable } from '../../src/types';
describe('setColumnAlias', () => {
  test('calculation of alias', () => {
    const sqlTables: SqlTable[] = [
      {
        alias: 'productAlias',
        columns: [
          {
            column: {
              isId: false,
              name: 'name',
              type: 'string',
            },
            alias: '',
          },
        ],
        table: {
          columns: [],
          name: 'product',
        },
      },
    ];
    setColumnAliases(sqlTables);

    expect(sqlTables[0].columns[0].alias).toBe(`name_of_productAlias`);
  });
});
