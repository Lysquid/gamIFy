<script lang="ts">
	import { goto } from "$app/navigation";
	import { ValueContainsFilter, searchGames, searchImage } from '$lib/requests';
	import { Spinner } from 'flowbite-svelte';

	let search = '';

	let data: any | null = null;

    let loading = false;

	async function searchQuery() {
        loading = true;
		data = (await searchGames([new ValueContainsFilter('gamelabel', search)])).results.bindings;

		await Promise.allSettled(
			data.map(async (el: any) => {
				if (el.image) {
					let img = await searchImage(el.image.value);
					el.image.value = img;
					data = data;
				}
			})
		);
        loading = false;
	}
</script>

<p class="text-gray-900 dark:text-white text-center text-2xl my-10">
	The ultimate Video Game search engine !
</p>
<form>
	<div class="flex max-w-3xl m-auto">
		<label
			for="search-dropdown"
			class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label
		>
		<button
			id="dropdown-button"
			data-dropdown-toggle="dropdown"
			class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
			type="button"
		>
			All categories
			<svg
				class="w-2.5 h-2.5 ms-2.5"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 10 6"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="m1 1 4 4 4-4"
				/></svg
			>
		</button>
		<div
			id="dropdown"
			class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
		>
			<ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
				<li>
					<button
						type="button"
						class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Mockups</button
					>
				</li>
				<li>
					<button
						type="button"
						class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Templates</button
					>
				</li>
				<li>
					<button
						type="button"
						class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Design</button
					>
				</li>
				<li>
					<button
						type="button"
						class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>Logos</button
					>
				</li>
			</ul>
		</div>
		<div class="relative w-full">
			<input
				bind:value={search}
				type="search"
				id="search-dropdown"
				class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
				placeholder="Search games, publishers, genres..."
				required
			/>
			<button
				on:click={searchQuery}
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
    <div class="flex flex-col mx-50 gap-5 mt-10 items-center">
        {#each data as item}
            <a href="/game/{encodeURIComponent(item.game.value.split('/').slice(-1))}" class="flex bg-white hover:bg-gray-50 shadow-lg dark:bg-gray-700 dark:hover:bg-gray-600 h-32 gap-5 rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer">
                {#if item.image}
                <img class="w-32 object-contain" src="{item.image.value}" alt=""/>
                {:else}
                <div class="w-32 object-contain"></div>
                {/if}
                <div class="my-auto w-96">
                    <h1 class="text-xl">{item.gamelabel.value}</h1>
                    {#if item.publisherlabel}
                        <p class="dark:text-gray-400 text-gray-600">published by <strong>{item.publisherlabel.value}</strong></p>
                    {/if}
                </div>
            </a>
        {/each}
    </div>
{:else if data}
    <p>No results</p>
{/if}
