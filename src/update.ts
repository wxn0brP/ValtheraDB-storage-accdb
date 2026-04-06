import { Data, DataInternal } from "@wxn0brp/db-core/types/data";
import { UpdateQuery } from "@wxn0brp/db-core/types/query";
import { hasFieldsAdvanced } from "@wxn0brp/db-core/utils/hasFieldsAdvanced";
import { AccDBValthera } from ".";
import { escapeValue } from "./utils";

export async function update(
    slv: AccDBValthera,
    query: UpdateQuery,
    one: boolean,
) {
    const { collection, search, updater, context } = query;

    const allEntries: Data[] = (await slv.db.query(`SELECT * FROM [${collection}]`)) as any[];

    const matched: Data[] = [];
    for (const entry of allEntries) {
        const match = typeof search === "function"
            ? search(entry, context)
            : hasFieldsAdvanced(entry, search);

        if (match) {
            matched.push(entry);
            if (one) break;
        }
    }

    if (matched.length === 0) return [];

    const updateOne = async (target: Data) => {
        const newData: any = typeof updater === "function"
            ? updater(target, context)
            : { ...target, ...updater };

        if (newData._id !== target._id)
            newData._id = target._id;

        const keys = Object.keys(newData).filter(k => k !== "_id");
        const set = keys.map(k => `[${k}] = ${escapeValue(newData[k])}`).join(", ");
        const sql = `UPDATE [${collection}] SET ${set} WHERE [_id] = ${escapeValue(target._id)}`;
        await slv.db.query(sql);
        return await slv.findOne({ collection, search: { _id: target._id } });
    };

    const results = [];

    for (const target of matched)
        results.push(await updateOne(target));

    return results as DataInternal[];
}
