<script lang="ts">
	import { Spinner } from "flowbite-svelte";

    let suggestions: string[] = [];
    let loading = false;
    export let search: string = '';
    export let getSuggestions: (search: string) => Promise<string[]> = async (_) => [];
    export let onSearch: (search: string) => Promise<void> = async (_) => {};
    export let placeholder: string = 'Search...';
</script>


<div class="relative w-full">
	<input
		bind:value={search}
		on:input={async ()=>{suggestions = await getSuggestions(search)}}
		type="search"
		class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
		placeholder="{placeholder}"
		list="search-results"
		required
	/>
	<datalist id="search-results">
		{#each suggestions as suggestion}
        	<option value="{suggestion}"></option>
        {/each}
	</datalist>
	<button
		on:click={async () => {loading = true; await onSearch(search); loading = false;}}
		type="submit"
		class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
	>
        {#if loading}
            <Spinner color="white" size="5"></Spinner>
        {:else}
            <svg
                class="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
            >
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
            </svg>
        {/if}
		<span class="sr-only">Search</span>
	</button>
</div>
