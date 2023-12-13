<script lang="ts">
	import ListBox from '$lib/components/ListBox.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ValueContainsFilter, searchEditors, searchGames, searchImage } from '$lib/requests';
	import { Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let search = '';

	let data: any[] | null = null;

    let loading = false;

    let type: string;
    type = $page.url.searchParams.get("type") || 'games';
    search = $page.url.searchParams.get("search") || '';

    function searchButton() {
        goto(`?search=${search}&type=${type}`);
    }

	async function searchQuery() {
        loading = true;
        data = null;
        if (type==="games") {
		    data = (await searchGames([new ValueContainsFilter('gamelabel', search)])).results.bindings;
            data.map(el => el.url = `/game/${encodeURIComponent(el.game.value.split('/').slice(-1))}`);
        } else if (type==="publishers") {
            console.log("editeur");
            data = (await searchEditors([new ValueContainsFilter('publisherlabel', search)])).results.bindings
            data.map(el => el.gamelabel = {value: el.publisherlabel.value});
            data.map(el => el.url = `/publisher/${encodeURIComponent(el.publisher.value.split('/').slice(-1))}`);
            data.map(el => el.publisherlabel = null);
        }


        if (data) {
            await Promise.allSettled(
                data.map(async (el: any) => {
                    if (el.image) {
                        let img = await searchImage(el.image.value);
                        el.image.value = img;
                        data = data;
                    }
                })
            );
        }
        loading = false;
	}

    onMount(async () => {

        if(search) {
            await searchQuery();
        }
    })
</script>

<p class="text-gray-900 dark:text-white text-center text-2xl my-10">
	The ultimate Video Game search engine !
</p>
<form>
	<div class="flex max-w-3xl m-auto rounded-lg overflow-hidden">       
		<select class="bg-blue-500 px-5" bind:value={type}>
			<option value="games">Games</option>
			<option value="publishers">Publishers</option>
		</select>

		<div class="relative w-full">
			<input
				bind:value={search}
				type="search"
				id="search-dropdown"
				class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
				placeholder="Search {type}"
				required
			/>
			<button
				on:click={() => {goto(`?search=${search}&type=${type}`);}}
				type="submit"
				class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
	</div>
</form>

{#if data && data.length != 0}
        <ListBox data={data}></ListBox>
{:else if data}
    <p class="text-center m-20 text-lg dark:text-gray-400 text-gray-600">No results</p>
{/if}
