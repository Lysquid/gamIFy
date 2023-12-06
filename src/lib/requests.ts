import { executeQuery } from "$lib";

type GameSearchFilterAttribute = "gamelabel" | "publisherlabel";

interface Filter<_> {
    getFilterLine(): string;
}

export class ValueContainsFilter<T> implements Filter<T> {
    attribute: T;
    value: string;

    constructor(type: T, value: string) {
        this.attribute = type;
        this.value = value;
    }

    getFilterLine(): string {
        return `FILTER(contains(lcase(?${this.attribute}), lcase("${this.value}"))).`;
    }
}

export async function searchGames(filters: Filter<GameSearchFilterAttribute>[]): Promise<any> {
    let filter_lines = filters.map(filter => filter.getFilterLine()).join("");

    let query = `SELECT DISTINCT ?gamelabel ?publisherlabel ?image WHERE {
?game a dbo:VideoGame.
?game dbo:publisher ?publisher.
?game dbo:thumbnail ?image.
?publisher rdfs:label ?publisherlabel.
?game rdfs:label ?gamelabel.
FILTER(lang(?gamelabel) = "en").
FILTER(lang(?publisherlabel) = "en").
${filter_lines}
}
limit 100`;

    return executeQuery(query);
}
