import { updateObjectAdvanced } from "@wxn0brp/db-core/utils/updateObject";
import { find } from "./find.js";
import { escapeValue } from "./utils.js";
export async function update(slv, query, one) {
    const { collection, updater, context } = query;
    const matched = await find(slv, {
        ...query,
        dbFindOpts: {
            limit: one ? 1 : undefined
        }
    });
    if (matched.length === 0)
        return [];
    const key = slv.primaryKey[collection] || "_id";
    const updateOne = async (target) => {
        const newData = typeof updater === "function"
            ? updater(target, context)
            : updateObjectAdvanced(target, updater);
        if (newData[key] !== target[key])
            newData[key] = target[key];
        const keys = Object.keys(newData).filter(k => k !== key);
        const set = keys.map(k => `[${k}] = ${escapeValue(newData[k])}`).join(", ");
        const sql = `UPDATE [${collection}] SET ${set} WHERE [${key}] = ${escapeValue(target[key])}`;
        await slv.db.query(sql);
        return newData;
    };
    const results = [];
    for (const target of matched)
        results.push(await updateOne(target));
    return results;
}
