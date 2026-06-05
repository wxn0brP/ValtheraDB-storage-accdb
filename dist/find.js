import { findUtil } from "@wxn0brp/db-core/utils/action";
import { findObj } from "@wxn0brp/db-core/utils/process";
import { escapeValue } from "./utils.js";
export async function find(slv, config) {
    const { collection, search } = config;
    let sqlResult = [];
    if (typeof search === "function" || Object.keys(search).length === 0) {
        sqlResult = (await slv.db.query(`SELECT * FROM [${collection}]`));
    }
    else {
        const baseKeys = Object.keys(search)
            .filter(k => search[k] !== undefined)
            .filter(k => !k.startsWith("$"))
            .filter(k => typeof search[k] !== "object");
        const where = baseKeys.map(k => `[${k}] = ${escapeValue(search[k])}`).join(" AND ");
        const baseSql = `SELECT * FROM [${collection}] WHERE ${where}`;
        sqlResult = (await slv.db.query(baseSql));
    }
    const result = sqlResult.filter(entry => findObj(entry, search));
    return findUtil(config, result, [null]);
}
