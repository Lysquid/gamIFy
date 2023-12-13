<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchGameInfos, searchGamePlatforms, searchGameGenre } from '$lib/requests';
	import { deserialize } from '$app/forms';
	
	export let data: PageData;
	let game: null | any;
	let platforms: null | any;
	let genres: null | any;
	let found: boolean = true;

	onMount(async () => {
		const results = await searchGameInfos(data.slug);
		if (results.results.bindings.length == 0) {
			found = false;
		}
		game = results.results.bindings[0];
	});

	onMount(async () => {
		const results = await searchGamePlatforms(data.slug);
		platforms = results.results.bindings;
	});

	onMount(async () => {
		const results = await searchGameGenre(data.slug);
		genres = results.results.bindings;
	});

</script>

<h1 class="text-2xl">{data.slug}</h1>

{#if found}
	{#if game}
		{#if game.description}
			<p>{game.description.value}</p>
		{/if}
	{:else}
		<p>Loading...</p>
	{/if}

	{#if platforms}
		<ul>
			{#each platforms as platform}
				<li>{platform.label.value}</li>
			{/each}
		</ul>
	{/if}

	{#if genres}
		<ul>
			{#each genres as genre}
				<li>{genre.label.value}</li>
			{/each}
		</ul>
	{/if}

{:else}
	<p>Not found</p>
{/if}
