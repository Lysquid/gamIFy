<script lang="ts">
	import ListBox, { type ListBoxDataType } from '$lib/components/ListBox.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte'
	import { ValueContainsFilter, searchGameSuggestions, searchGames, searchImage, searchPublisherSuggestions, searchPublishers } from '$lib/requests';
	import type { Snapshot } from './$types';

	let search = '';

	let data: ListBoxDataType[] | null = null;

	let error: boolean = false;

    let type: string;

	async function searchQuery(search: string): Promise<void> {
		error = false;
        data = null;
        if (type==="games") {
		    const res = (await searchGames([new ValueContainsFilter('gamelabel', search)]))?.results.bindings;
			if (!res) {
				error = true;
			} else {
	            data = await Promise.all(res.map(async (el: any): Promise<ListBoxDataType> => { return {
	                    url: `/game/${encodeURIComponent(el.game.value.split('/').slice(-1))}`, 
	                    title: el.gamelabel.value,
	                    description: el.publisherlabel.value != "" ? `Published by : <strong>${el.publisherlabel.value}</strong>`: undefined,
	                    image: el.image ? await searchImage(el.image.value) : undefined,
	            }}));
			}
        } else if (type==="publishers") {
            const res = (await searchPublishers([new ValueContainsFilter('publisherlabel', search)]))?.results.bindings
			if (!res) {
				error = true;
			} else {
	            data = await Promise.all(res.map(async (el: any): Promise<ListBoxDataType> => { return {
	                url: `/publisher/${encodeURIComponent(el.publisher.value.split('/').slice(-1))}`,
	                title: el.publisherlabel.value,
	                image: el.image ? await searchImage(el.image.value) : undefined,
	            }}));
			}
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

	export const snapshot: Snapshot<any[]> = {
		capture: () => [data, search, type],
		restore: (value) => {[data, search, type] = value},
	}
</script>

<p class="text-gray-900 dark:text-white text-center text-2xl my-10">
	The ultimate Video Game search engine !
</p>
<form>
	<div class="flex max-w-3xl m-auto rounded-lg overflow-hidden">       
		<select class="bg-blue-500 px-5 text-white" bind:value={type}>
			<option value="games">Games</option>
			<option value="publishers">Publishers</option>
		</select>
		
		<SearchBar getSuggestions={loadSuggestions} onSearch={searchQuery} placeholder="search for {type}" search={search}></SearchBar>
	</div>
</form>

{#if error}
    <p class="text-center m-20 text-lg dark:text-red-400 text-red-600">Error loading data</p>
{:else if data && data.length != 0}
        <ListBox data={data}></ListBox>
{:else if data}
    <p class="text-center m-20 text-lg dark:text-gray-400 text-gray-600">No results</p>
{/if}
