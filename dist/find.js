import { findUtil } from "@wxn0brp/db-core/utils/findUtil";
import { findObj } from "@wxn0brp/db-core/utils/process";
import { decodeCell, SPILL, sqlIdent, VID } from "./utils.js";
function decodeRow(row) {
    const doc = {};
    for (const [column, value] of Object.entries(row)) {
        if (column === VID || column === SPILL)
            continue;
        if (value === null || value === undefined)
            continue;
        doc[column] = decodeCell(value);
    }
    const extra = row[SPILL];
    if (extra !== null && extra !== undefined) {
        const fields = decodeCell(extra);
        if (fields && typeof fields === "object" && !Array.isArray(fields))
            Object.assign(doc, fields);
    }
    return doc;
}
export async function selectRows(slv, collection) {
    await slv.init();
    if (!(await slv.issetCollection(collection)))
        return [];
    const result = (await slv.db.query(`SELECT * FROM ${sqlIdent(collection)}`));
    if (!Array.isArray(result))
        return [];
    return result.map(row => ({
        vid: decodeCell(row[VID]),
        doc: decodeRow(row),
    }));
}
export async function selectMatching(slv, query, limit) {
    const rows = await selectRows(slv, query.collection);
    const out = [];
    for (const row of rows) {
        if (!findObj({
            collection: query.collection,
            search: query.search,
        }, row.doc))
            continue;
        out.push(row);
        if (limit && out.length >= limit)
            break;
    }
    return out;
}
export async function find(slv, config) {
    const rows = await selectRows(slv, config.collection);
    const datas = [];
    for (const row of rows) {
        const doc = findObj(config, row.doc);
        if (doc)
            datas.push(doc);
    }
    return findUtil(config, datas, [
        null,
    ]);
}
