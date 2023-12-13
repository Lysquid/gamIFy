<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchGameInfos, searchGameDetail, searchImage } from '$lib/requests';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import { Spinner } from 'flowbite-svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';
	
	export let data: PageData;
	let game: null | any;
	let platforms: null | any;
	let publishers: null | any;
	let developers: null | any;
	let genres: null | any;
	let loading: boolean = true;

	onMount(async () => {
		const results = await searchGameInfos(data.slug);
		game = results.results.bindings[0];
		if (game.image) {
			game.image.value = await searchImage(game.image.value);
		}
		loading = false;
	});

	onMount(async () => {
		const results = await searchGameDetail("computingPlatform", data.slug);
		platforms = results.results.bindings;
	});

	onMount(async () => {
		genres = (await searchGameDetail("genre", data.slug)).results.bindings;
	});

	onMount(async () => {
		publishers = (await searchGameDetail("publisher", data.slug)).results.bindings;
	});

	onMount(async () => {
		developers = (await searchGameDetail("developer", data.slug)).results.bindings;
	});

</script>


{#if loading}
	<Spinner></Spinner>
{:else if game}
	<InfoPage
		title={game?.label?.value || ''}
		description={game?.description?.value || ''}
		image={game?.image?.value || ''}
	>
		<ul slot="info-entry">
			{#if game.date}
				<InfoPageTableEntry title="Date">
					{game.date.value}
				</InfoPageTableEntry>
			{/if}
			{#if game.gameEngine}
				<InfoPageTableEntry title="Game engine">
					{game.gameEngine.value}
				</InfoPageTableEntry>
			{/if}
		</ul>


		<div slot="content">
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
		
			{#if publishers}
				<h1 class="text-3xl mt-10">Publishers</h1>
				<ul>
					{#each publishers as publisher}
						<li>{publisher.label.value}</li>
					{/each}
				</ul>
			{/if}

			{#if developers}
			<h1 class="text-3xl mt-10">Developers</h1>
			<ul>
				{#each developers as developers}
					<li>{developers.label.value}</li>
				{/each}
			</ul>
		{/if}
		</div>
	</InfoPage>
{:else}
	Not found
{/if}

