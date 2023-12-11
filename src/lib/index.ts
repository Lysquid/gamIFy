// place files you want to import through the `$lib` alias in this folder.

export const DBPEDIA_URL: string = "http://dbpedia.org/sparql";

export async function executeQuery(query: string): Promise<any> {
    let response = await fetch(urlFromQuery(query));
    console.log(query);
    return response.json();
}

function urlFromQuery(query: string): string {
    return `${DBPEDIA_URL}?query=${encodeURIComponent(query)}&format=json`;
}