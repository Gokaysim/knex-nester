export interface Column {
  name: string;
  type: string;
  isId: boolean;
  isUnique?: boolean;
  foreignKeyTo?: { table: string; column: string };
}
