import { executeQuery } from "$lib";

type FilterAttribute = "gamelabel" | "publisher";

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

export async function searchGameInfos(game: string): Promise<any> {
    return executeQuery(`
        SELECT ?label ?image ?description MIN(?date) as ?date ?gameEngine WHERE {
            BIND(<http://dbpedia.org/resource/${game}> AS ?game).
            ?game rdfs:label ?label.
            OPTIONAL {?game dbo:thumbnail ?image.}
            OPTIONAL {?game dbo:releaseDate ?date.}
            OPTIONAL {
                ?game dbo:abstract ?description.
                FILTER(lang(?description) = "en").
            }
            OPTIONAL {
                ?game dbo:gameEngine ?gameEngineUri.
                ?gameEngineUri rdfs:label ?gameEngine.
                FILTER(lang(?gameEngine) = "en").
            }
            FILTER(lang(?label) = "en").
        }
        LIMIT 1
    `);
}

export async function searchGameDetail(detail: string, game: string): Promise<any> {
    return executeQuery(`
        SELECT ?uri ?label ?image WHERE {
            BIND(<http://dbpedia.org/resource/${game}> AS ?game).
            ?game dbo:${detail} ?uri.
            ?uri rdfs:label ?label.
            FILTER(lang(?label) = "en").
            OPTIONAL {?game dbo:thumbnail ?image.}
        }
    `);
}

export async function searchPublisherInfo(publisher: string): Promise<any> {

    let query = `
        SELECT ?publisherlabel ?description ?emp ?homepage ?image ?citylabel
        GROUP_CONCAT(DISTINCT ?people; SEPARATOR=" | ") as ?keyPeople 
        WHERE {
        BIND(<http://dbpedia.org/resource/${publisher}> AS ?publisher).
        ?publisher rdfs:label ?publisherlabel.
        FILTER(lang(?publisherlabel) = "en").
        OPTIONAL {?publisher dbo:abstract ?description. FILTER(lang(?description) = "en")}.
        OPTIONAL {?publisher dbo:numberOfEmployees ?emp.}.
        OPTIONAL {?publisher foaf:homepage ?homepage.}.
        OPTIONAL {?publisher dbo:thumbnail ?image.}.
        OPTIONAL {?publisher dbo:locationCity ?city. ?city rdfs:label ?citylabel. FILTER(lang(?citylabel) = "en").}.
        ?publisher dbp:keyPeople ?people.
        ?game dbo:publisher ?publisher.
        }
        GROUP BY ?publisherlabel ?description ?emp ?homepage ?image ?citylabel
        LIMIT 1
    `
    return executeQuery(query);
}

export async function searchGenreInfo(genre: string): Promise<any> {

    let query = `
        SELECT ?label ?description ?image WHERE {
        BIND(<http://dbpedia.org/resource/${genre}> AS ?genre).
        ?genre rdfs:label ?label.
        ?genre ^dbo:genre ?game.
        FILTER(lang(?label) = "en").
        OPTIONAL {?genre dbo:abstract ?description. FILTER(lang(?description) = "en")}.
        OPTIONAL {?genre dbo:thumbnail ?image.}.
        }
        LIMIT 1
    `
    return executeQuery(query);
}
