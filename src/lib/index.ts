// place files you want to import through the `$lib` alias in this folder.

export const DBPEDIA_URL: string = "http://dbpedia.org/sparql";

export async function executeQuery(query: string, singleResult=false): Promise<any> {
    let response = await fetch(urlFromQuery(query));
    console.log(query);
    if (response.ok) {
        let json = await response.json()
        if (json.results.bindings.length == 0) {
            throw new Error("Not found");
        }
        if (singleResult) {
            return json.results.bindings[0];
        } else {
            return json.results.bindings;
        }
    } else {
        throw new Error(response.statusText)
    }
}

function urlFromQuery(query: string): string {
    return `${DBPEDIA_URL}?query=${encodeURIComponent(query)}&format=json`;
}
