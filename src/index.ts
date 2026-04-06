import { genId, ValtheraClass } from "@wxn0brp/db-core";
import { ActionsBase } from "@wxn0brp/db-core/base/actions";
import { Data } from "@wxn0brp/db-core/types/data";
import * as Query from "@wxn0brp/db-core/types/query";
import odbc from "odbc";
import { find } from "./find";
import { remove } from "./remove";
import { SupportedDB } from "./types";
import { update } from "./update";
import { escapeValue } from "./utils";

export class AccDBValthera extends ActionsBase {
    _inited = true;

    constructor(public db: SupportedDB) {
        super();
    }

    async getCollections(): Promise<string[]> {
        const result = await this.db.tables(null, null, null, "TABLE");
        return result.map((row: any) => row.TABLE_NAME || row.table_name);
    }

    async add(config: Query.AddQuery): Promise<Data> {
        const { data, id_gen = true, collection } = config;

        if (id_gen && !data._id) data._id = genId();

        const keys = Object.keys(data);
        const values = keys.map(k => escapeValue(data[k]));
        const sql = `INSERT INTO [${collection}] (${keys.map(k => `[${k}]`).join(", ")}) VALUES (${values.join(", ")})`;

        await this.db.query(sql);
        return data;
    }

    find(config: Query.FindQuery): Promise<Data[]> {
        return find(this, config);
    }

    async findOne(config: Query.FindQuery): Promise<Data | null> {
        config.dbFindOpts = { limit: 1 };
        const result = await this.find(config);
        return result.length ? result[0] : null;
    }

    update(config: Query.UpdateQuery) {
        return update(this, config, false);
    }

    async updateOne(config: Query.UpdateQuery) {
        const res = await update(this, config, true);
        return res[0] || null;
    }

    remove(config: Query.RemoveQuery) {
        return remove(this, config, false);
    }

    async removeOne(config: Query.RemoveQuery) {
        const res = await remove(this, config, true);
        return res[0] || null;
    }

    async removeCollection(collection: string): Promise<boolean> {
        const sql = `DROP TABLE [${collection}]`;
        await this.db.query(sql);
        return true;
    }

    async issetCollection(collection: string): Promise<boolean> {
        try {
            const sql = `SELECT TOP 1 * FROM [${collection}]`;
            await this.db.query(sql);
            return true;
        } catch (e) {
            return false;
        }
    }

    async ensureCollection(collection: string): Promise<boolean> {
        const issetCollection = await this.issetCollection(collection);
        if (!issetCollection)
            throw new Error(`Collection "${collection}" not found. Please create it first.`);

        return true;
    }
}

export function createAccDBValthera(db: SupportedDB) {
    const dbAction = new AccDBValthera(db);
    return new ValtheraClass({ dbAction });
}

export function makeConnect(file: string) {
    return odbc.connect(`Driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${file}`);
}
