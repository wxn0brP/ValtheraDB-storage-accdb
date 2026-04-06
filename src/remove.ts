import { Data, DataInternal } from "@wxn0brp/db-core/types/data";
import { RemoveQuery } from "@wxn0brp/db-core/types/query";
import { hasFieldsAdvanced } from "@wxn0brp/db-core/utils/hasFieldsAdvanced";
import { AccDBValthera } from ".";
import { escapeValue } from "./utils";

export async function remove(slv: AccDBValthera, query: RemoveQuery, one: boolean) {
    const { collection, search, context } = query;

    const allEntries: Data[] = (await slv.db.query(`SELECT * FROM [${collection}]`)) as any[];

    const toDelete: Data[] = [];

    for (const entry of allEntries) {
        const match = typeof search === "function"
            ? search(entry, context)
            : hasFieldsAdvanced(entry, search);

        if (match) {
            toDelete.push(entry);
            if (one) break;
        }
    }

    if (!toDelete.length) return [];

    for (const entry of toDelete)
        await slv.db.query(`DELETE FROM [${collection}] WHERE [_id] = ${escapeValue(entry._id)}`);

    return toDelete as DataInternal[];
}
