export interface Connection {
  foreignKeys: { table: string; column: string }[];
  table: string;
  // to be used as the name of the prop
  propName: string;
}

export interface SqlConnection {
  connection: Connection;
  // to be used on sql query
  alias: string;
}
