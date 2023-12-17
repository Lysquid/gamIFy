// place files you want to import through the `$lib` alias in this folder.

export const DBPEDIA_URL: string = "http://dbpedia.org/sparql";

export async function executeQuery(query: string): Promise<any> {
    let response = await fetch(urlFromQuery(query));
    console.log(query);
    return response.status == 200 ? response.json().then(res => {return res.results.bindings}) : undefined;
}

export async function executeQuerySingleResult(query: string): Promise<any> {
    let response = await fetch(urlFromQuery(query));
    console.log(query);
    return response.status == 200 ? response.json().then(res => {return res.results.bindings[0]}) : undefined;
}

function urlFromQuery(query: string): string {
    return `${DBPEDIA_URL}?query=${encodeURIComponent(query)}&format=json`;
}
