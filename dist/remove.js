import { find } from "./find.js";
import { escapeValue } from "./utils.js";
export async function remove(slv, query, one) {
    const { collection } = query;
    const toDelete = await find(slv, {
        ...query,
        dbFindOpts: {
            limit: one ? 1 : undefined
        }
    });
    if (!toDelete.length)
        return [];
    const key = slv.primaryKey[collection] || "_id";
    for (const entry of toDelete)
        await slv.db.query(`DELETE FROM [${collection}] WHERE [${key}] = ${escapeValue(entry[key])}`);
    return toDelete;
}
