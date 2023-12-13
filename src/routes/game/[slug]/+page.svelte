<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchGameInfos, searchGamePlatforms, searchGameGenres, searchImage } from '$lib/requests';
	import InfoPage from '$lib/components/InfoPage.svelte';
	
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
		if (game.image) {
			game.image.value = await searchImage(game.image.value);
		}
	});

	onMount(async () => {
		const results = await searchGamePlatforms(data.slug);
		platforms = results.results.bindings;
	});

	onMount(async () => {
		const results = await searchGameGenres(data.slug);
		genres = results.results.bindings;
	});
</script>


<InfoPage
	title={data.slug}
	description={game?.description?.value || ''}
	image={game?.image?.value || ''}
	tableInfos = {[]}
>
<slot>
	{#if platforms}
		<h1 class="text-3xl mt-10">Platforms</h1>
		<ul>
			{#each platforms as platform}
				<li>{platform.label.value}</li>
			{/each}
		</ul>
	{/if}

	{#if genres}
		<h1 class="text-3xl mt-10">Genre</h1>
		<ul>
			{#each genres as genre}
				<li>{genre.label.value}</li>
			{/each}
		</ul>
	{/if}
</slot>
</InfoPage>
