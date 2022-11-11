import { SqlTable } from '../types';

const createDefinition = (mainTable: string, sqlTables: SqlTable[]): any => {
  const mainTableSchema = sqlTables.find((item) => item.alias === mainTable)!;
  const definition: any = {};

  mainTableSchema.columns.forEach((column) => {
    definition[column.column.name] = {
      column: column.alias,
      id: column.column.isId,
    };
  });

  mainTableSchema.pluralConnections.forEach((pluralConnection) => {
    definition[pluralConnection.connection.propName] = [createDefinition(pluralConnection.alias, sqlTables)];
  });
  mainTableSchema.singularConnections.forEach((singularConnection) => {
    definition[singularConnection.connection.propName] = createDefinition(singularConnection.alias, sqlTables);
  });

  return definition;
};

export default createDefinition;
