import { executeQuery } from "$lib";

type FilterAttribute = "gamelabel" | "publisherlabel";

interface Filter {
    getFilterLine(): string;
}

export class ValueContainsFilter implements Filter {
    attribute: FilterAttribute;
    value: string;

    constructor(type: FilterAttribute, value: string) {
        this.attribute = type;
        this.value = value;
    }

    getFilterLine(): string {
        return `FILTER(contains(lcase(?${this.attribute}), lcase("${this.value}"))).`;
    }
}

export async function searchGames(filters: Filter[]): Promise<any> {
    let filter_lines = filters.map(filter => filter.getFilterLine()).join("");

    let query = `SELECT DISTINCT ?game ?gamelabel ?publisherlabel ?image WHERE {
?game a dbo:VideoGame.
OPTIONAL {?game dbo:thumbnail ?image.}
OPTIONAL {?game dbo:publisher ?publisher.
?publisher rdfs:label ?publisherlabel.
FILTER(lang(?publisherlabel) = "en").}
?game rdfs:label ?gamelabel.
FILTER(lang(?gamelabel) = "en").
${filter_lines}
}
limit 100`;

    return executeQuery(query);
}

export async function searchImage(originalUri: string): Promise<string> {
    let urlParts = originalUri.split("/");
    let last = urlParts[urlParts.length - 1];
    let filename = last.split("?")[0];
    let apiRequestUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${filename}&prop=imageinfo&iiprop=url&format=json&redirects&origin=*`;

    let response = await fetch(apiRequestUrl);
    let body = await response.json();
    let pageId = Object.keys(body.query.pages)[0];

    return body.query.pages[pageId].imageinfo[0].url;
}

export async function searchGameInfo(game: string): Promise<any> {

    let query = `
    SELECT ?title ?image ?description MIN(?date) as ?firstdate WHERE {
        BIND(<http://dbpedia.org/resource/${game}> AS ?game).
        ?game rdfs:label ?title.
        OPTIONAL {?game dbo:thumbnail ?image.}
        OPTIONAL {?game dbo:releaseDate ?date.}
        OPTIONAL {?game dbo:abstract ?description.
        FILTER(lang(?description) = "en").}
        FILTER(lang(?title) = "en").
        }
        LIMIT 1
    `
    return executeQuery(query);
}
