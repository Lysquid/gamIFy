<script lang="ts">
	import ListBox, { type ListBoxDataType } from '$lib/components/ListBox.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { ValueContainsFilter, searchGameSuggestions, searchGames, searchImage, searchPublisherSuggestions, searchPublishers, type Filter } from '$lib/requests';
	import type { Snapshot } from './$types';
	import inView from '$lib/inView';
	import { Spinner } from 'flowbite-svelte';

	let search = '';

	let data: ListBoxDataType[] | null = null;

	let error: boolean = false;

	let sort: "wikiPageLength" | "date";

    let type: "game" | "company";

	let order: "asc" | "desc";

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
        if (type==="game") {
		    res = await getGamesData(search);
		} else if (type==="company") {
			res = await getPublishersData(search);
		}
		if (!res) {
			error = true;
		} else {
			data = res;
		}
	}

	async function getGamesData(search: string) : Promise<ListBoxDataType[] | undefined> {
		let filters: Filter[] = [];
		if (search) {
			filters.push(new ValueContainsFilter('label', search));
		}
	    const res = (await searchGames(filters, sort, order, page_length, offset));
		let result;
		if (!res) {
			result = undefined;
		} else {
            result = res.map((el: any): ListBoxDataType => { return {
					uri: el.uri.value,
                    title: el.label.value,
                    description: el.publishers.value != "" ? `Published by : <strong>${el.publishers.value}</strong>`: undefined,
                    image: el.image?.value,
            }});
		}
		if (res.length < page_length) {
			loadedAll = true;
		}
		return result;
	}

	async function getPublishersData(search: string) : Promise<ListBoxDataType[] | undefined> {
		let filters: Filter[] = [];
		if (search) {
			filters.push(new ValueContainsFilter('label', search));
		}
        const res = (await searchPublishers(filters, page_length, offset));
		let result;
		if (!res) {
			result = undefined;
		} else {
            result = res.map((el: any): ListBoxDataType => { return {
                uri: el.uri.value,
                title: el.label.value,
                image: el.image?.value,
            }});
		}
		if (res.length < page_length) {
			loadedAll = true;
		}
		return result;
	}

	async function loadSuggestions(search: string): Promise<string[]> {
		let res;
		if(type==="game") {
			res = (await searchGameSuggestions(search));
		} else if (type==="company") {
			res = (await searchPublisherSuggestions(search));
		}
		return res.map((el: any) => el.label.value);
	}

	async function loadMore() {
		loadingMore = true;
		offset += page_length;
		if(data) {
			// console.log(await getGamesData(search));
			// data = data.concat(await getGamesData(search) || []);
			// console.log(data);
	        if (type==="game") {
			    data = data.concat(await getGamesData(search) || []);
			} else if (type==="company") {
				data = data.concat(await getPublishersData(search) || []);
			}
		}
		loadingMore = false;
		// data = data;
	}

	export const snapshot: Snapshot<any[]> = {
		capture: () => [data, search, type, sort, order],
		restore: (value) => {[data, search, type, sort, order] = value},
	}
</script>

<p class="text-gray-900 dark:text-white text-center text-2xl mb-10">
	The ultimate Video Game search engine !
</p>
<form>
	<div class="flex max-w-3xl m-auto rounded-lg overflow-hidden">       
		<select class="bg-blue-700 px-5 text-white" bind:value={type} on:change={()=>{data=null;}}>
			<option value="game">Games</option>
			<option value="company">Publishers</option>
		</select>
		
		<SearchBar getSuggestions={loadSuggestions} onSearch={searchQuery} placeholder="search for a {type}" bind:search></SearchBar>
	</div>
	{#if type == "game"}
		<div class="flex max-w-3xl mx-auto justify-center my-10 items-center space-x-10">
			<div class="flex items-center space-x-2">
				<label for="sort-select">Sort by</label>
				<select class="dark:bg-blue-900 bg-blue-700 p-2 rounded-lg text-white" id="sort-select" bind:value={sort} on:change={async () => await searchQuery(search)}>
					<option value="wikiPageLength">Popularity</option>
					<option value="date">Release Date</option>
					<option value="IGN">IGN Score</option>
				</select>
			</div>
			<div class="flex items-center space-x-2">
				<label for="sort-select">Order</label>
				<select class="dark:bg-blue-900 bg-blue-700 p-2 rounded-lg text-white" id="sort-select" bind:value={order} on:change={async () => await searchQuery(search)}>
					<option value="desc">Descending</option>
					<option value="asc">Ascending</option>
				</select>
			</div>
		</div>
	{/if}
</form>

{#if error}
    <p class="text-center m-20 text-lg dark:text-red-400 text-red-600">Error loading data</p>
{:else if data && data.length != 0}
	<div class="flex flex-col mx-50 gap-5 mt-10 items-center">
		{#each data as item}
			<ListBox title={item.title} description={item.description} image={item.image} uri={item.uri} type={type}></ListBox>
		{/each}
	</div>
	<!-- <button on:click={loadMore}>Load More</button> -->
	{#if !loadedAll}
		<p use:inView on:enter={loadMore}></p>
	{:else }
		<p class="text-center dark:text-gray-500 text-gray-300 p-5">No more results</p>
	{/if}
	{#if loadingMore}
		<div class="flex w-full justify-center mt-5">
			<Spinner color="blue"></Spinner>
		</div>
	{/if}
{:else if data}
    <p class="text-center m-20 text-lg dark:text-gray-400 text-gray-600">No results</p>
{/if}
