import {Knex} from "knex";
import Table = Knex.Table;
import {Column} from "./column";

export interface SqlColumn{
    alias:string;
    column:Column;
}
