import Nest from 'nesthydrationjs';
const NestHydrationJS = Nest();

import { SqlTable } from '../types';
import createDefinition from './getDefinition';
export default (data: any[], mainTable: string, sqlTables: SqlTable[]): any[] => {
  const definition = [createDefinition(mainTable, sqlTables)];
  return NestHydrationJS.nest(data, definition);
};
