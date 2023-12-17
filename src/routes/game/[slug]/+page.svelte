<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchGameInfos, searchList, searchGamesByGenre } from '$lib/requests';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import { Spinner } from 'flowbite-svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';
	import SmallList from '$lib/components/SmallList.svelte';
	
	export let data: PageData;
	let game = searchGameInfos(data.slug);
	let platforms: Promise<any>;
	let publishers: Promise<any>;
	let developers: Promise<any>;
	let genres: Promise<any>;
	let similar_games: Promise<any>;
	
	onMount(async () => {
		game = searchGameInfos(data.slug);
		platforms = searchList("computingPlatform", data.slug, 5);
		publishers = searchList("publisher", data.slug);
		developers = searchList("developer", data.slug);
		genres = searchList("genre", data.slug);
		similar_games = searchGamesByGenre(data.slug)
	});

</script>


{#await game}
	<Spinner color="blue"></Spinner>
{:then game}

	<InfoPage title={game.label.value} description={game.description?.value} image={game.image?.value}>
		
		<ul slot="info-entry">
			<InfoPageTableEntry title="Date" value={game.date?.value}/>
			<InfoPageTableEntry title="Game engine" value={game.gameEngines?.value}/>
			<InfoPageTableEntry title="Series" value={game.series?.value}/>
			<InfoPageTableEntry title="Modes" value={game.modes?.value}/>
			<InfoPageTableEntry title="IGN score" value={game.IGN?.value}/>
		</ul>

		<div slot="content" class="grid xl:grid-cols-2 gap-x-8 gap-y-8 mt-10">
			<SmallList title="Publishers" type="publisher" promise={publishers}/>
			<SmallList title="Developers" type="publisher" promise={developers}/>
			<SmallList title="Genres" type="genre" promise={genres}/>
			<SmallList title="Platforms" type="platform" promise={platforms}/>
			<SmallList title="Popular games of the same genre" type="game" promise={similar_games}/>
		</div>
	</InfoPage>

{:catch error}
	<p>{error}</p>
{/await}
