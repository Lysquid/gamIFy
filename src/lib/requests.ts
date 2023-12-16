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

export async function searchGames(filters: Filter[], orderby: "wikipagelength" | "date" | "IGN", length: number, offset: number): Promise<any> {
    let filter_lines = filters.map(filter => filter.getFilterLine()).join("");

    return executeQuery(`
        SELECT DISTINCT
            ?game
            ?gamelabel
            ?image 
            MIN(?releaseDate) as ?date
            GROUP_CONCAT(distinct ?publisherlabels; separator = ", ") as ?publisherlabel
            SUM(?IGN)/COUNT(?IGN) as ?IGN
        WHERE {
            ?game a dbo:VideoGame.
            OPTIONAL {?game dbo:thumbnail ?image.}
            OPTIONAL {?game dbo:publisher ?publisher.}
            ?publisher rdfs:label ?publisherlabels.
            FILTER(lang(?publisherlabels) = "en").
            OPTIONAL {?game dbo:releaseDate ?trueDate.}
            BIND(coalesce(?trueDate, 0) as ?releaseDate).
            ?game rdfs:label ?gamelabel.
            ?game dbo:wikiPageLength ?wikipagelength.
            FILTER(lang(?gamelabel) = "en").
            OPTIONAL {
                ?game rdfs:comment ?description.
                FILTER(lang(?description) = "en").
                FILTER(contains(?description, "game")).
            }
            ${filter_lines}
            OPTIONAL {
                {
                    ?game dbp:ign ?IGN.
                    FILTER(?IGN<=10).
                }
                UNION
                {
                    ?game dbp:ign ?hundred.
                    FILTER(?hundred>10).
                    FILTER(?hundred<=100). 
                    BIND((?hundred/10.0) AS ?IGN).
                }
            }
        }
        GROUP BY ?game ?gamelabel ?image ?wikipagelength
        ORDER BY DESC(?${orderby})
        LIMIT ${length}
        OFFSET ${offset}
    `);
}

export async function searchPublishers(filters: Filter[], length: number, offset: number): Promise<any> {
    let filter_lines = filters.map(filter => filter.getFilterLine()).join("");

    return executeQuery(`
        SELECT 
            ?publisher 
            ?publisherlabel 
            ?image 
            (count(?published) as ?nbpublished) 
        WHERE {
            ?publisher a dbo:Company.
            OPTIONAL{?publisher dbo:thumbnail ?image.}
            ?publisher rdfs:label ?publisherlabel.
            FILTER(lang(?publisherlabel) = "en").
            ${filter_lines}
            ?published dbo:publisher ?publisher.
            ?published a dbo:VideoGame.
        }
        ORDER BY DESC (?nbpublished)
        LIMIT ${length}
        OFFSET ${offset}
    `);
}

export async function searchGameSuggestions(filters: Filter[]): Promise<any> {
    let filter_lines = filters.map(filter => filter.getFilterLine()).join("");
    return executeQuery(`
        SELECT DISTINCT ?gamelabel WHERE {
            ?game a dbo:VideoGame.
            ?game rdfs:label ?gamelabel.
            ?game dbo:wikiPageLength ?wikipagelength.
            FILTER(lang(?gamelabel) = "en").
            ${filter_lines}
        }
        GROUP BY ?game ?gamelabel ?wikipagelength
        ORDER BY DESC(?wikipagelength)
        LIMIT 5
    `);
}

export async function searchPublisherSuggestions(filters: Filter[]): Promise<any> {
    let filter_lines = filters.map(filter => filter.getFilterLine()).join("");
    return executeQuery(`
        SELECT 
            ?publisherlabel 
            (count(?published) as ?nbpublished) 
        WHERE {
            ?publisher a dbo:Company.
            ?publisher rdfs:label ?publisherlabel.
            FILTER(lang(?publisherlabel) = "en").
            ${filter_lines}
            ?published dbo:publisher ?publisher.
            ?published a dbo:VideoGame.
        }
        ORDER BY DESC (?nbpublished)
        LIMIT 5
    `);
}

export async function searchGamesByGenre(source: string): Promise<any> {
    return executeQuery(`
        SELECT DISTINCT
            ?game
            ?gamelabel
            ?image 
        WHERE {
            BIND(<http://dbpedia.org/resource/${source}> AS ?source).
            ?source dbo:genre ?genre.
            ?game a dbo:VideoGame.
            OPTIONAL {?game dbo:thumbnail ?image.}
            ?game rdfs:label ?gamelabel.
            FILTER(lang(?gamelabel) = "en").
            ?game dbo:wikiPageLength ?wikipagelength.
            ?game dbo:genre ?genre.
        }
        GROUP BY ?game ?gamelabel ?image ?wikipagelength
        ORDER BY DESC (?wikipagelength)
        LIMIT 5
    `);
}

export async function searchImage(originalUri: string): Promise<string | undefined> {
    let urlParts = originalUri.split("/");
    let last = urlParts[urlParts.length - 1];
    let filename = last.split("?")[0];
    let apiRequestUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${filename}&prop=imageinfo&iiprop=url&format=json&redirects&origin=*`;

    let response = await fetch(apiRequestUrl);
    let body = await response.json();
    let pageId = Object.keys(body.query.pages)[0];

    return body.query?.pages[pageId]?.imageinfo?.at(0)?.url;
}

export async function searchGameInfos(game: string): Promise<any> {
    return executeQuery(`
        SELECT 
            ?label
            ?image
            ?description
            MIN(?date) as ?date
            GROUP_CONCAT(distinct ?gameEngine; separator=", ") as ?gameEngines
            GROUP_CONCAT(distinct ?oneSeries; separator=", ") as ?series
            GROUP_CONCAT(distinct ?mode; separator=", ") as ?modes
            SUM(?IGN)/COUNT(?IGN) as ?IGN
        WHERE {
            BIND(<http://dbpedia.org/resource/${game}> AS ?game).
            ?game rdfs:label ?label.
            OPTIONAL {?game dbo:thumbnail ?image.}
            OPTIONAL {?game dbo:releaseDate ?date.}
            OPTIONAL {
                ?game rdfs:comment ?description.
                FILTER(lang(?description) = "en").
            }
            OPTIONAL {
                ?game dbo:gameEngine ?gameEngineUri.
                ?gameEngineUri rdfs:label ?gameEngine.
                FILTER(lang(?gameEngine) = "en").
            }
            OPTIONAL {
                ?game dbo:series ?oneSeriesUri.
                ?oneSeriesUri rdfs:label ?oneSeries.
                FILTER(lang(?oneSeries) = "en").
            }
            OPTIONAL {
                ?game dbo:series ?seriesUri.
                ?seriesUri rdfs:label ?series.
                FILTER(lang(?series) = "en").
            }
            OPTIONAL {
                ?game dbp:modes ?modeUri.
                ?modeUri rdfs:label ?mode.
                FILTER(lang(?mode) = "en"). 
            }
            OPTIONAL {
                {
                    ?game dbp:ign ?IGN.
                    FILTER(?IGN<=10).
                }
                UNION
                {
                    ?game dbp:ign ?hundred.
                    FILTER(?hundred>10).
                    FILTER(?hundred<=100). 
                    BIND((?hundred/10.0) AS ?IGN).
                }
            }
            FILTER(lang(?label) = "en").
        }
        GROUP BY ?label ?image ?description ?date
        LIMIT 1
    `);
}

export async function searchPlatformInfos(platform: string): Promise<any> {
    return executeQuery(`
        SELECT 
            ?label
            ?image
            ?description
            ?date
            COUNT(?game) as ?nb_games
        WHERE {
            BIND(<http://dbpedia.org/resource/${platform}> AS ?uri).
            ?uri rdfs:label ?label.
            FILTER(lang(?label) = "en").
            OPTIONAL {?uri dbo:thumbnail ?image.}
            OPTIONAL {
                ?uri dbp:date ?date.
                FILTER(lang(?description) = "en").
            }
            OPTIONAL {
                ?uri rdfs:comment ?description.
                FILTER(lang(?description) = "en").
            }
            ?game dbo:computingPlatform ?uri.
        }
        GROUP BY ?label ?image ?description ?date
        LIMIT 1
    `);
}

export async function searchList(type: string, source: string, limit=5, reverse=false): Promise<any> {
    return executeQuery(`
        SELECT ?uri ?label ?image WHERE {
            BIND(<http://dbpedia.org/resource/${source}> AS ?source).
            ${reverse ? '?uri' : '?source'} dbo:${type} ${reverse ? '?source' : '?uri'}.
            ?uri rdfs:label ?label.
            ?uri dbo:wikiPageLength ?wikipagelength.
            FILTER(lang(?label) = "en").
            OPTIONAL {?uri dbo:thumbnail ?image.}
        }
        ORDER BY DESC(?wikipagelength)
        ${limit > 0 ? 'LIMIT ' + limit : ''}
    `);
}

export async function searchPublisherInfo(publisher: string): Promise<any> {

    let query = `
        SELECT ?publisherlabel ?description ?emp ?homepage ?image ?citylabel ?foundingDate ?founderName
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
        OPTIONAL {?publisher dbp:keyPeople ?people.}
        OPTIONAL {?publisher dbo:foundingDate ?foundingDate.}
        OPTIONAL {?publisher dbp:founder ?founder. ?founder rdfs:label ?founderName}
        ?game dbo:publisher ?publisher.
        ?game a dbo:VideoGame.
        }
        GROUP BY ?publisherlabel ?description ?emp ?homepage ?image ?citylabel ?foundingDate ?founderName
        LIMIT 1
    `
    return executeQuery(query);
}

export async function searchGenreInfo(genre: string): Promise<any> {

    let query = `
        SELECT ?label ?description ?image min(?releaseDate) as ?createdDate count(?game) as ?gamecount WHERE {
        BIND(<http://dbpedia.org/resource/${genre}> AS ?genre).
        ?genre rdfs:label ?label.
        ?genre ^dbo:genre ?game.
        ?game a dbo:VideoGame.
        FILTER(lang(?label) = "en").
        OPTIONAL {?genre dbo:abstract ?description. FILTER(lang(?description) = "en")}.
        OPTIONAL {?genre dbo:thumbnail ?image.}.
        OPTIONAL {?game dbo:releaseDate ?releaseDate}
        }
        GROUP BY ?label ?description ?image
        LIMIT 1
    `
    return executeQuery(query);
}
