<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchGameInfos, searchGameDetail, searchImage } from '$lib/requests';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import { Spinner } from 'flowbite-svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';
	import SmallListBox from '$lib/components/SmallListBox.svelte';
	
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
	<Spinner color="blue"></Spinner>
{:else if game}
	<InfoPage
		title={game.label?.value || ''}
		description={game.description?.value || ''}
		image={game.image?.value || ''}
	>
		<ul slot="info-entry">
			{#if game.date}
				<InfoPageTableEntry title="Date">
					{game.date.value}
				</InfoPageTableEntry>
			{/if}
			{#if game.gameEngines?.value}
				<InfoPageTableEntry title="Game engine">
					{game.gameEngines.value}
				</InfoPageTableEntry>
			{/if}
			{#if game.series?.value}
				<InfoPageTableEntry title="Series">
					{game.series.value}
				</InfoPageTableEntry>
			{/if}
			{#if game.modes?.value}
				<InfoPageTableEntry title="Modes">
					{game.modes.value}
				</InfoPageTableEntry>
			{/if}
			{#if game.IGN}
				<InfoPageTableEntry title="IGN score">
					{game.IGN.value}
				</InfoPageTableEntry>
			{/if}
		</ul>


		<div slot="content" class="grid xl:grid-cols-2 gap-x-8 gap-y-8 mt-10">

			{#if publishers?.length}
				<div>
					<h1 class="text-3xl">Publishers</h1>
					{#each publishers as publisher}
						<SmallListBox name={publisher.label.value} type="publisher" uri={publisher.uri.value} image={publisher.image?.value}/>
					{/each}
				</div>
			{/if}

			{#if developers?.length}
				<div>
					<h1 class="text-3xl">Developers</h1>
					{#each developers as developer}
						<SmallListBox name={developer.label.value} type="publisher" uri={developer.uri.value} image={developer.image?.value}/>
					{/each}
				</div>
			{/if}

			{#if genres?.length}
				<div>
					<h1 class="text-3xl">Genres</h1>
					{#each genres as genre}
						<SmallListBox name={genre.label.value} type="genre" uri={genre.uri.value} image={genre.image?.value}/>
					{/each}
				</div>
			{/if}

			{#if platforms?.length}
				<div>
					<h1 class="text-3xl">Platforms</h1>
					{#each platforms as platform}
						<SmallListBox name={platform.label.value} type="platform" uri={platform.uri.value} image={platform.image?.value}/>
					{/each}
				</div>
			{/if}
		
		</div>
	</InfoPage>
{:else}
	Not found
{/if}
