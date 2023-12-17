// place files you want to import through the `$lib` alias in this folder.

export const DBPEDIA_URL: string = "http://dbpedia.org/sparql";

export async function executeQuery(query: string, singleResult=false): Promise<any> {
    let response = await fetch(urlFromQuery(query));
    console.log(query);
    if (response.ok) {
        return response.json().then(res => {
            if (singleResult) {
                return res.results.bindings[0];
            } else {
                return res.results.bindings;
            }
        })
    } else {
        throw new Error(response.statusText)
    }
}

function urlFromQuery(query: string): string {
    return `${DBPEDIA_URL}?query=${encodeURIComponent(query)}&format=json`;
}
