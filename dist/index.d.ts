import { ValtheraClass } from "@wxn0brp/db-core";
import { ActionsBase } from "@wxn0brp/db-core/base/actions";
import { Data } from "@wxn0brp/db-core/types/data";
import { VQueryT } from "@wxn0brp/db-core/types/query";
import odbc from "odbc";
import { SupportedDB } from "./types.js";
export declare class AccDBValthera extends ActionsBase {
    db: SupportedDB;
    primaryKey: Record<string, string>;
    _inited: boolean;
    constructor(db: SupportedDB, primaryKey?: Record<string, string>);
    getCollections(): Promise<string[]>;
    add(config: VQueryT.Add): Promise<Data>;
    find(config: VQueryT.Find): Promise<Data[]>;
    findOne(config: VQueryT.Find): Promise<Data>;
    update(config: VQueryT.Update): Promise<import("@wxn0brp/db-core/types/data").DataInternal[]>;
    updateOne(config: VQueryT.Update): Promise<import("@wxn0brp/db-core/types/data").DataInternal>;
    remove(config: VQueryT.Remove): Promise<import("@wxn0brp/db-core/types/data").DataInternal[]>;
    removeOne(config: VQueryT.Remove): Promise<import("@wxn0brp/db-core/types/data").DataInternal>;
    removeCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    ensureCollection(collection: string): Promise<boolean>;
}
export declare function createAccDBValthera(db: SupportedDB, primaryKey?: Record<string, string>): ValtheraClass;
export declare function makeConnect(file: string): Promise<odbc.Connection>;
export declare const DYNAMIC: {
    accdb(file: string, keys?: Record<string, string>): Promise<ValtheraClass>;
};
