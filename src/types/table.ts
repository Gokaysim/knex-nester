import { Column } from './column';
import { Connection } from './connection';

export interface Table {
  columns: Column[];
  name: string;

  pluralConnections: Connection[];
  singularConnections: Connection[];
}
