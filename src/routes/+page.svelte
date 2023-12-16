<script lang="ts">
	import InfoPage from '$lib/components/InfoPage.svelte';
	import ListBox, { type ListBoxDataType } from '$lib/components/ListBox.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { ValueContainsFilter, searchGameSuggestions, searchGames, searchImage, searchPublisherSuggestions, searchPublishers } from '$lib/requests';
	import type { Snapshot } from './$types';
	import inView from '$lib/inView';
	import { Spinner } from 'flowbite-svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';

	let search = '';

	let data: ListBoxDataType[] | null = null;

	let error: boolean = false;

	let sort: "wikipagelength" | "date";

    let type: string;

	let loadedAll = false;

	let loadingMore = false;

	const page_length = 50;
	let offset = 0;

	async function searchQuery(search: string): Promise<void> {
		offset = 0;
		error = false;
        data = null;
		loadedAll = false;
		let res;
        if (type==="games") {
		    res = await getGamesData(search);
		} else if (type==="publishers") {
			res = await getPublishersData(search);
		}
		if (!res) {
			error = true;
		} else {
			data = res;
		}
	}

	async function getGamesData(search: string) : Promise<ListBoxDataType[] | undefined> {
	    const res = (await searchGames([new ValueContainsFilter('gamelabel', search)], sort, page_length, offset))?.results.bindings;
		if (res.length < page_length) {
			loadedAll = true;
		}
		if (!res) {
			return undefined;
		} else {
            return await Promise.all(res.map(async (el: any): Promise<ListBoxDataType> => { return {
                    url: `/game/${encodeURIComponent(el.game.value.split('/').slice(-1))}`, 
                    title: el.gamelabel.value,
                    description: el.publisherlabel.value != "" ? `Published by : <strong>${el.publisherlabel.value}</strong>`: undefined,
                    image: el.image ? await searchImage(el.image.value) : undefined,
            }}));
		}
	}

	async function getPublishersData(search: string) : Promise<ListBoxDataType[] | undefined> {
        const res = (await searchPublishers([new ValueContainsFilter('publisherlabel', search)], page_length, offset))?.results.bindings
		if (res.length < page_length) {
			loadedAll = true;
		}
		if (!res) {
			return undefined;
		} else {
            return await Promise.all(res.map(async (el: any): Promise<ListBoxDataType> => { return {
                url: `/publisher/${encodeURIComponent(el.publisher.value.split('/').slice(-1))}`,
                title: el.publisherlabel.value,
                image: el.image ? await searchImage(el.image.value) : undefined,
            }}));
		}
	}

	async function loadSuggestions(search: string): Promise<string[]> {
		if(type==="games") {
			const res = (await searchGameSuggestions([new ValueContainsFilter('gamelabel', search)]))?.results.bindings;
			return res.map((el: any) => el.gamelabel.value);
		
		} else if (type==="publishers") {
			const res = (await searchPublisherSuggestions([new ValueContainsFilter('publisherlabel', search)]))?.results.bindings;
			return res.map((el: any) => el.publisherlabel.value);
		}
		return [];
	}

	async function loadMore() {
		loadingMore = true;
		offset += page_length;
		if(data) {
			// console.log(await getGamesData(search));
			// data = data.concat(await getGamesData(search) || []);
			// console.log(data);
	        if (type==="games") {
			    data = data.concat(await getGamesData(search) || []);
			} else if (type==="publishers") {
				data = data.concat(await getPublishersData(search) || []);
			}
		}
		loadingMore = false;
		// data = data;
	}

	export const snapshot: Snapshot<any[]> = {
		capture: () => [data, search, type],
		restore: (value) => {[data, search, type] = value},
	}
</script>

<p class="text-gray-900 dark:text-white text-center text-2xl mb-10">
	The ultimate Video Game search engine !
</p>
<form>
	<div class="flex max-w-3xl m-auto rounded-lg overflow-hidden">       
		<select class="bg-blue-500 px-5 text-white" bind:value={type} on:change={()=>{data=null;}}>
			<option value="games">Games</option>
			<option value="publishers">Publishers</option>
		</select>
		
		<SearchBar getSuggestions={loadSuggestions} onSearch={searchQuery} placeholder="search for {type}" bind:search></SearchBar>
	</div>
	{#if type == "games"}
		<div class="flex max-w-3xl mx-auto justify-center my-10 items-center">
			<label for="sort-select">Sort by</label>
			<select class="dark:bg-blue-900 p-2 rounded-lg" id="sort-select" bind:value={sort} on:change={async () => await searchQuery(search)}>
				<option value="wikipagelength">Popularity</option>
				<option value="date">Release Date</option>
			</select>
		</div>
	{/if}
</form>

{#if error}
    <p class="text-center m-20 text-lg dark:text-red-400 text-red-600">Error loading data</p>
{:else if data && data.length != 0}
	<ListBox data={data}></ListBox>
	<!-- <button on:click={loadMore}>Load More</button> -->
	{#if !loadedAll}
		<p use:inView on:enter={async () => {console.log(loadedAll); await loadMore()}}></p>
	{/if}
	{#if loadingMore}
		<div class="flex w-full justify-center mt-5">
			<Spinner color="blue"></Spinner>
		</div>
	{/if}
{:else if data}
    <p class="text-center m-20 text-lg dark:text-gray-400 text-gray-600">No results</p>
{/if}
