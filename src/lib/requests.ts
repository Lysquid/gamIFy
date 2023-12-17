import { executeQuery } from "$lib";

type FilterAttribute = "label";

export interface Filter {
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


export class AttributeFilter implements Filter {
    attribute: string;
    value: string;

    constructor(type: string, value: string) {
        this.attribute = type;
        this.value = value;
    }

    getFilterLine(): string {
        return `
            BIND(<http://dbpedia.org/resource/${this.value}> AS ?filterUri).
            ?game dbo:${this.attribute} ?filterUri.
            ?filterUri rdfs:label ?filterLabel.
            FILTER(lang(?filterLabel) = "en").
        `;
    }
}

export async function searchGames(filters: Filter[], orderby: "wikiPageLength" | "date" | "IGN", length: number, offset: number): Promise<any> {
    let filter_lines = filters.map(filter => filter.getFilterLine()).join("");

    return executeQuery(`
        SELECT DISTINCT
            ?game as ?uri
            ?label
            ?image 
            MIN(?releaseDate) as ?date
            GROUP_CONCAT(distinct ?publisher; separator = ", ") as ?publishers
            SUM(?IGN)/COUNT(?IGN) as ?IGN
        WHERE {
            ?game a dbo:VideoGame.
            OPTIONAL {?game dbo:thumbnail ?image.}
            OPTIONAL {?game dbo:publisher ?publisherUri.}
            ?publisherUri rdfs:label ?publisher.
            FILTER(lang(?publisher) = "en").
            OPTIONAL {?game dbo:releaseDate ?trueDate.}
            BIND(coalesce(?trueDate, 0) as ?releaseDate).
            ?game dbo:wikiPageLength ?wikiPageLength.
            ?game rdfs:label ?label.
            FILTER(lang(?label) = "en").
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
        GROUP BY ?game ?label ?image ?wikiPageLength
        ORDER BY DESC(?${orderby})
        LIMIT ${length}
        OFFSET ${offset}
    `);
}

export async function searchPublishers(filters: Filter[], length: number, offset: number): Promise<any> {
    let filter_lines = filters.map(filter => filter.getFilterLine()).join("");

    return executeQuery(`
        SELECT 
            ?publisher as ?uri 
            ?label
            ?image 
            count(?published) as ?nbPublished
        WHERE {
            ?publisher a dbo:Company.
            OPTIONAL{?publisher dbo:thumbnail ?image.}
            ?publisher rdfs:label ?label.
            FILTER(lang(?label) = "en").
            ${filter_lines}
            ?published dbo:publisher ?publisher.
            ?published a dbo:VideoGame.
        }
        ORDER BY DESC (?nbPublished)
        LIMIT ${length}
        OFFSET ${offset}
    `);
}

export async function searchGameSuggestions(search: string): Promise<any> {
    return executeQuery(`
        SELECT DISTINCT
            ?label
        WHERE {
            ?game a dbo:VideoGame.
            ?game rdfs:label ?label.
            ?game dbo:wikiPageLength ?wikiPageLength.
            FILTER(lang(?label) = "en").
            FILTER(strstarts(lcase(?label), lcase("${search}")))
        }
        GROUP BY ?game ?label ?wikiPageLength
        ORDER BY DESC(?wikiPageLength)
        LIMIT 5
    `);
}

export async function searchPublisherSuggestions(search: string): Promise<any> {
    return executeQuery(`
        SELECT 
            ?label 
            (count(?published) as ?nbPublished) 
        WHERE {
            ?publisher a dbo:Company.
            ?publisher rdfs:label ?label.
            FILTER(lang(?label) = "en").
            ?published dbo:publisher ?publisher.
            ?published a dbo:VideoGame.
            FILTER(strstarts(lcase(?label), lcase("${search}")))
        }
        ORDER BY DESC (?nbPublished)
        LIMIT 5
    `);
}

export async function searchGamesByGenre(source: string): Promise<any> {
    return executeQuery(`
        SELECT DISTINCT
            ?game as ?uri
            ?label
            ?image 
        WHERE {
            BIND(<http://dbpedia.org/resource/${source}> AS ?source).
            ?source dbo:genre ?genre.
            ?game a dbo:VideoGame.
            OPTIONAL {?game dbo:thumbnail ?image.}
            ?game rdfs:label ?label.
            FILTER(lang(?label) = "en").
            ?game dbo:wikiPageLength ?wikiPageLength.
            ?game dbo:genre ?genre.
        }
        GROUP BY ?game ?label ?image ?wikiPageLength
        ORDER BY DESC (?wikiPageLength)
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
    `, true);
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
                {
                    ?uri dbp:date ?date.
                } UNION {
                    ?uri dbp:releasedate ?date.
                }
            }
            OPTIONAL {
                ?uri rdfs:comment ?description.
                FILTER(lang(?description) = "en").
            }
            ?game dbo:computingPlatform ?uri.
        }
        GROUP BY ?label ?image ?description ?date
        LIMIT 1
    `, true);
}

export async function searchList(type: string, source: string, limit=5): Promise<any> {
    return executeQuery(`
        SELECT ?uri ?label ?image WHERE {
            BIND(<http://dbpedia.org/resource/${source}> AS ?source).
            ?source dbo:${type} ?uri.
            ?uri rdfs:label ?label.
            FILTER(lang(?label) = "en").
            OPTIONAL {?uri dbo:thumbnail ?image.}
            ?uri dbo:wikiPageLength ?wikiPageLength.
        }
        ORDER BY DESC(?wikiPageLength)
        ${limit > 0 ? 'LIMIT ' + limit : ''}
    `);
}

export async function searchPublisherInfo(publisher: string): Promise<any> {
    return executeQuery(`
        SELECT
            ?label
            ?description
            ?numberOfEmployees
            ?homepage
            ?image
            ?city
            ?foundingDate
            ?founderName
            GROUP_CONCAT(DISTINCT ?keyPerson; SEPARATOR="|") as ?keyPeople
        WHERE {
            BIND(<http://dbpedia.org/resource/${publisher}> AS ?publisher).
            ?publisher rdfs:label ?label.
            FILTER(lang(?label) = "en").
            OPTIONAL {
                ?publisher rdfs:comment ?description.
                FILTER(lang(?description) = "en")
            }.
            OPTIONAL {?publisher dbo:numberOfEmployees ?numberOfEmployees.}.
            OPTIONAL {?publisher foaf:homepage ?homepage.}.
            OPTIONAL {?publisher dbo:thumbnail ?image.}.
            OPTIONAL {
                ?publisher dbo:locationCity ?cityUri.
                ?cityUri rdfs:label ?city.
                FILTER(lang(?city) = "en").
            }.
            OPTIONAL {
                ?publisher dbp:keyPeople ?keyPeopleUri.
                ?keyPeopleUri rdfs:label ?keyPerson.
                FILTER(lang(?keyPerson) = "en").
            }
            OPTIONAL {?publisher dbo:foundingDate ?foundingDate.}
            OPTIONAL {
                ?publisher dbp:founder ?founder.
                ?founder rdfs:label ?founderName
            }
            ?game dbo:publisher ?publisher.
            ?game a dbo:VideoGame.
        }
        GROUP BY ?label ?description ?numberOfEmployees ?homepage ?image ?city ?foundingDate ?founderName
        LIMIT 1
    `, true);
}

export async function searchGenreInfo(genre: string): Promise<any> {
    return executeQuery(`
        SELECT
            ?label
            ?description
            ?image
            MIN(?releaseDate) as ?createdDate
            COUNT(?game) as ?gamecount
        WHERE {
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
    `, true);
}
