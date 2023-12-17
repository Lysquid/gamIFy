<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchGameInfos, searchList, searchImage, searchGamesByGenre } from '$lib/requests';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import { Spinner } from 'flowbite-svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';
	import SmallListBox from '$lib/components/SmallListBox.svelte';
	import SmallList from '$lib/components/SmallList.svelte';
	
	export let data: PageData;
	let game: null | any;
	let platforms: Promise<any>;
	let publishers: Promise<any>;
	let developers: Promise<any>;
	let genres: Promise<any>;
	let similar_games: Promise<any>;
	let loading: boolean = true;

	onMount(async () => {
		platforms = searchList("computingPlatform", data.slug, 5);
		publishers = searchList("publisher", data.slug);
		developers = searchList("developer", data.slug);
		genres = searchList("genre", data.slug);
		similar_games = searchGamesByGenre(data.slug)

		const results = await searchGameInfos(data.slug);
		game = results[0];
		if (game.image) {
			game.image.value = await searchImage(game.image.value);
		}
		loading = false;
	});

</script>


{#if loading}
	<Spinner color="blue"></Spinner>
{:else if game}
	<InfoPage title={game.label.value} description={game.description?.value} image={game.image?.value}>
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

			<SmallList title="Publishers" type="publisher" promise={publishers}/>
			<SmallList title="Developers" type="publisher" promise={developers}/>
			<SmallList title="Genres" type="genre" promise={genres}/>
			<SmallList title="Platforms" type="platform" promise={platforms}/>
			<SmallList title="Popular games of the same genre" type="game" promise={similar_games}/>
		
		</div>
	</InfoPage>
{:else}
	Not found
{/if}
