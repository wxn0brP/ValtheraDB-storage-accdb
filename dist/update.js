import { QueryValidationError } from "@wxn0brp/db-core/errors";
import { updateObjectAdvanced } from "@wxn0brp/db-core/utils/updateOperators";
import { selectMatching } from "./find.js";
import { VID, sqlIdent, sqlString, SPILL } from "./utils.js";
function applyUpdater(target, updater) {
    const doc = {
        ...target,
    };
    if (updater && typeof updater === "object") {
        updateObjectAdvanced(doc, updater);
        return doc;
    }
    if (updater !== undefined && updater !== null)
        throw new QueryValidationError("Invalid updater value", {
            op: "update",
            updater,
        });
    return doc;
}
async function writeRow(slv, collection, row, doc) {
    const columns = [];
    const values = [];
    const spill = {};
    const fields = new Set([
        ...Object.keys(row.doc),
        ...Object.keys(doc),
    ]);
    for (const field of fields) {
        const has = Object.hasOwn(doc, field) && doc[field] !== undefined;
        const column = await slv._ensureColumn(collection, field);
        if (!column) {
            if (has)
                spill[field] = doc[field];
            continue;
        }
        columns.push(column);
        values.push(has ? sqlString(doc[field]) : "NULL");
    }
    if (Object.keys(spill).length) {
        const column = await slv._ensureColumn(collection, SPILL);
        if (column) {
            columns.push(column);
            values.push(sqlString(spill));
        }
    }
    if (!columns.length)
        return;
    const sets = columns
        .map((column, i) => `${sqlIdent(column)} = ${values[i]}`)
        .join(", ");
    await slv.db.query(`UPDATE ${sqlIdent(collection)} SET ${sets} WHERE ${sqlIdent(VID)} = ${sqlString(row.vid)}`);
}
export async function update(slv, query, one) {
    const { collection, updater } = query;
    const rows = await selectMatching(slv, query, one ? 1 : undefined);
    const results = [];
    for (const row of rows) {
        const doc = applyUpdater(row.doc, updater);
        await writeRow(slv, collection, row, doc);
        results.push(doc);
    }
    return results;
}
