import { DataInternal } from "@wxn0brp/db-core/types/data";
import { VQueryT } from "@wxn0brp/db-core/types/query";
import { AccDBValthera } from "./index.js";
export declare function remove(slv: AccDBValthera, query: VQueryT.Remove, one: boolean): Promise<DataInternal[]>;
