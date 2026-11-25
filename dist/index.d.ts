import { ValtheraClass } from "@wxn0brp/db-core";
import { AdapterBase } from "@wxn0brp/db-core/base/adapter";
import { Data } from "@wxn0brp/db-core/types/data";
import { VQueryT } from "@wxn0brp/db-core/types/query";
import { SupportedDB } from "./types.js";
export declare function createDatabase(file: string): Promise<string>;
export declare function makeConnect(file: string): Promise<SupportedDB>;
export declare class AccDBValthera extends AdapterBase {
    db: SupportedDB;
    _inited: boolean;
    primaryKey: Record<string, string>;
    file: string | null;
    private _columns;
    private _ensured;
    constructor(db: SupportedDB, primaryKey?: Record<string, string>);
    init(): Promise<void>;
    close(): Promise<void>;
    getCollections(): Promise<string[]>;
    listTables(): Promise<string[]>;
    issetCollection(collection: string): Promise<boolean>;
    ensureCollection(collection: string): Promise<boolean>;
    removeCollection(collection: string): Promise<boolean>;
    add(config: VQueryT.Add): Promise<Data>;
    find(config: VQueryT.Find): Promise<Data[]>;
    findOne(config: VQueryT.Find): Promise<Data>;
    update(config: VQueryT.Update): Promise<import("@wxn0brp/db-core/types/data").DataInternal[]>;
    updateOne(config: VQueryT.Update): Promise<import("@wxn0brp/db-core/types/data").DataInternal>;
    remove(config: VQueryT.Remove): Promise<import("@wxn0brp/db-core/types/data").DataInternal[]>;
    removeOne(config: VQueryT.Remove): Promise<import("@wxn0brp/db-core/types/data").DataInternal>;
    _ensureColumn(collection: string, field: string): Promise<string | null>;
    private ensureTable;
    private loadColumns;
}
export declare function createAccDBValthera(db: SupportedDB, primaryKey?: Record<string, string>): ValtheraClass;
export declare const DYNAMIC: {
    def(file: string, keys?: Record<string, string>): Promise<ValtheraClass>;
};
