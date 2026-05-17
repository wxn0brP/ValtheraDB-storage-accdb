import { genId, ValtheraClass } from "@wxn0brp/db-core";
import { ActionsBase } from "@wxn0brp/db-core/base/actions";
import odbc from "odbc";
import { find } from "./find.js";
import { remove } from "./remove.js";
import { update } from "./update.js";
import { escapeValue } from "./utils.js";
export class AccDBValthera extends ActionsBase {
    db;
    primaryKey;
    _inited = true;
    constructor(db, primaryKey = {}) {
        super();
        this.db = db;
        this.primaryKey = primaryKey;
    }
    async getCollections() {
        const result = await this.db.tables(null, null, null, "TABLE");
        return result.map((row) => row.TABLE_NAME || row.table_name);
    }
    async add(config) {
        const { data, id_gen = true, collection } = config;
        if (id_gen && !data._id)
            data._id = genId();
        const keys = Object.keys(data);
        const values = keys.map(k => escapeValue(data[k]));
        const sql = `INSERT INTO [${collection}] (${keys.map(k => `[${k}]`).join(", ")}) VALUES (${values.join(", ")})`;
        await this.db.query(sql);
        return data;
    }
    find(config) {
        return find(this, config);
    }
    async findOne(config) {
        config.dbFindOpts = { limit: 1 };
        const result = await this.find(config);
        return result.length ? result[0] : null;
    }
    update(config) {
        return update(this, config, false);
    }
    async updateOne(config) {
        const res = await update(this, config, true);
        return res[0] || null;
    }
    remove(config) {
        return remove(this, config, false);
    }
    async removeOne(config) {
        const res = await remove(this, config, true);
        return res[0] || null;
    }
    async removeCollection(collection) {
        const sql = `DROP TABLE [${collection}]`;
        await this.db.query(sql);
        return true;
    }
    async issetCollection(collection) {
        try {
            const sql = `SELECT TOP 1 * FROM [${collection}]`;
            await this.db.query(sql);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async ensureCollection(collection) {
        const issetCollection = await this.issetCollection(collection);
        if (!issetCollection)
            throw new Error(`Collection "${collection}" not found. Please create it first.`);
        return true;
    }
}
export function createAccDBValthera(db, primaryKey = {}) {
    const dbAction = new AccDBValthera(db, primaryKey);
    return new ValtheraClass({ dbAction });
}
export function makeConnect(file) {
    return odbc.connect(`Driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${file}`);
}
export const DYNAMIC = {
    async accdb(file, keys = {}) {
        return createAccDBValthera(await makeConnect(file), keys);
    }
};
