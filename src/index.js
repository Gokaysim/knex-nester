import Nest from 'nesthydrationjs';
import pluralize from 'pluralize';


const NestHydrationJS = Nest();
const snakeToCamel = str => str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));


const fillDefinition = (definition, table, tableParents, tableColumns, usedTables) => {
  if (!usedTables.includes(table)) {
    usedTables.push(table);
    tableParents[table].children.forEach((child) => {
      if (!usedTables.includes(child)) {
        const childPlural = pluralize(child);
        // eslint-disable-next-line no-param-reassign
        definition[childPlural] = [tableColumns[child]];
        fillDefinition(definition[childPlural][0], child, tableParents, tableColumns, usedTables);
      }
    });
    tableParents[table].parents.forEach((parent) => {
      if (!usedTables.includes(parent)) {
        // eslint-disable-next-line no-param-reassign
        definition[parent] = tableColumns[parent];
        fillDefinition(definition[parent], parent, tableParents, tableColumns, usedTables);
      }
    });
  }
};

const knexNester = hierarchyCallback => (knexQuery) => {
  // eslint-disable-next-line no-underscore-dangle
  const { table } = knexQuery._single;

  // eslint-disable-next-line no-underscore-dangle
  const columnsStatement = knexQuery._statements.find(statement => statement.grouping === 'columns');
  if (!columnsStatement) {
    return knexQuery;
  }

  const tableColumns = {};
  const tableParents = { [table]: { children: [], parents: [] } };
  columnsStatement.value = columnsStatement.value.map((column) => {
    if (!column.includes('.')) {
      // eslint-disable-next-line no-throw-literal
      throw `all columns need table name prefix: ${column}`;
    }
    if (column.includes('as')) {
      // eslint-disable-next-line no-throw-literal
      throw 'all columns must not be named. Remove as clause';
    }
    // column alteration

    const alias = column.replace('.', '_');
    // nester object definition creation
    const split = column.split('.');
    tableParents[split[0]] = { children: [], parents: [] };
    if (tableColumns[split[0]]) {
      tableColumns[split[0]][split[1]] = { column: snakeToCamel(alias) };
    } else {
      tableColumns[split[0]] = {
        [split[1]]: { column: snakeToCamel(alias) }
      };
    }
    return `${column} as ${alias}`;
  });


  // eslint-disable-next-line no-underscore-dangle
  const joins = knexQuery._statements.filter(statement => statement.joinType);
  joins.forEach((join) => {
    const split1 = join.clauses[0].column.split('.');
    const split2 = join.clauses[0].value.split('.');

    if (!tableParents[split1[0]]) {
      tableParents[split1[0]] = { parents: [], children: [] };
    }

    const leftSideIsMasterTable = hierarchyCallback(join.clauses[0].column, join.clauses[0].value);

    if (leftSideIsMasterTable) {
      if (tableParents[split2[0]]) {
        tableParents[split2[0]].parents.push(split1[0]);
      } else {
        tableParents[split2[0]] = { parents: [split1[0]], children: [] };
      }
      if (tableParents[split1[0]]) {
        tableParents[split1[0]].children.push(split2[0]);
      } else {
        tableParents[split1[0]] = { children: [split2[0]], parents: [] };
      }
    } else {
      if (tableParents[split2[0]]) {
        tableParents[split2[0]].children.push(split1[0]);
        // tableParents[split1[0]].push(split2[0]);
      } else {
        tableParents[split2[0]] = { parents: [], children: [split1[0]] };
      }
      if (tableParents[split1[0]]) {
        tableParents[split1[0]].parents.push(split2[0]);
        // tableParents[split1[0]].push(split2[0]);
      } else {
        tableParents[split1[0]] = { children: [], parents: [split2[0]] };
      }
    }
  });

  return knexQuery.then((data) => {
    if (!data) {
      return null;
    }
    const singleTableColumns = tableColumns[table];
    const definition = [singleTableColumns];
    const usedTables = [];
    fillDefinition(definition[0], table, tableParents, tableColumns, usedTables);
    return NestHydrationJS.nest(data, definition);
  });
};

// alternative shortcut

export default knexNester;
