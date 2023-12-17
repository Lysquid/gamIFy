<script lang="ts">
	import { Spinner } from "flowbite-svelte";
	import ListBox from "./ListBox.svelte";
	import { AttributeFilter, searchGames } from "$lib/requests";

    export var filter: AttributeFilter;
	let games: Promise<any>;
    let sort: "wikiPageLength" | "date" | "IGN" = "wikiPageLength";
    search();
    
    async function search() {
        games = searchGames([filter], sort, 10, 0);
    }

</script>

<h1 class="text-3xl">Games</h1>

<form class="my-6">
    <label for="sort-select">Sort by</label>
    <select class="dark:bg-blue-900 bg-blue-700 p-2 rounded-lg text-white" id="sort-select" bind:value={sort} on:change={async () => await search()}>
        <option value="wikiPageLength">Popularity</option>
        <option value="date">Release Date</option>
        <option value="IGN">IGN Score</option>
    </select>
</form>

<div class="flex flex-col mx-50 gap-5">
    {#await games}
        <Spinner color="blue"></Spinner>
    {:then games}
        {#each games as game}
            <ListBox title={game.label.value} type="game" uri={game.uri.value} image={game.image?.value}></ListBox>
        {/each}
    {:catch error}
        <p>{error}</p>
    {/await}
</div>