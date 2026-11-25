import { VQueryT } from "@wxn0brp/db-core/types/query";
import type { AccDBValthera } from "./index.js";
export interface Row {
    vid: string;
    doc: any;
}
export declare function selectRows(slv: AccDBValthera, collection: string): Promise<Row[]>;
export declare function selectMatching(slv: AccDBValthera, query: VQueryT.Find | VQueryT.Update | VQueryT.Remove, limit?: number): Promise<Row[]>;
export declare function find(slv: AccDBValthera, config: VQueryT.Find): Promise<import("@wxn0brp/db-core/types/data").Data[]>;
