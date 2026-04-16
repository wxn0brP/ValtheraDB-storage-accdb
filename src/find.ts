import { Data } from "@wxn0brp/db-core/types/data";
import { VQueryT } from "@wxn0brp/db-core/types/query";
import { findUtil } from "@wxn0brp/db-core/utils/action";
import { hasFieldsAdvanced } from "@wxn0brp/db-core/utils/hasFieldsAdvanced";
import { AccDBValthera } from ".";
import { escapeValue } from "./utils";

export async function find(slv: AccDBValthera, config: VQueryT.Find): Promise<Data[]> {
    const { collection, search, context } = config;

    let sqlResult: any[] = [];

    if (typeof search === "function" || Object.keys(search).length === 0) {
        sqlResult = (await slv.db.query(`SELECT * FROM [${collection}]`)) as any[];
    } else {
        const baseKeys = Object.keys(search)
            .filter(k => search[k] !== undefined)
            .filter(k => !k.startsWith("$"))
            .filter(k => typeof search[k] !== "object");

        const where = baseKeys.map(k => `[${k}] = ${escapeValue(search[k])}`).join(" AND ");
        const baseSql = `SELECT * FROM [${collection}] WHERE ${where}`;
        sqlResult = (await slv.db.query(baseSql)) as any[];
    }

    let result = sqlResult.filter(entry =>
        typeof search === "function" ? search(entry, context) : hasFieldsAdvanced(entry, search)
    );

    return findUtil(
        config,
        {
            find() {
                return result;
            }
        } as any,
        [null]
    )
}
