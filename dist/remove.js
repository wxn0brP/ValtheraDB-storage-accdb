import { selectMatching } from "./find.js";
import { VID, sqlIdent, sqlString } from "./utils.js";
export async function remove(slv, query, one) {
    const { collection } = query;
    const rows = await selectMatching(slv, query, one ? 1 : undefined);
    for (const row of rows)
        await slv.db.query(`DELETE FROM ${sqlIdent(collection)} WHERE ${sqlIdent(VID)} = ${sqlString(row.vid)}`);
    return rows.map(row => row.doc);
}
