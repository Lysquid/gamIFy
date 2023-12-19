<script lang="ts">
	import type { PageData } from './$types';
	import { searchGameInfos, searchList, searchGamesByGenre, searchImage } from '$lib/requests';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import { Spinner } from 'flowbite-svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';
	import SmallList from '$lib/components/SmallList.svelte';
	import CardList from '$lib/components/CardList.svelte';
	export let data: PageData;
</script>


{#await searchGameInfos(data.slug)}
	<Spinner color="blue"></Spinner>
{:then game}

	<InfoPage title={game.label.value} description={game.description?.value} image={game.image?.value}>
		
		<ul slot="info-entry">
			<InfoPageTableEntry title="Date" value={game.date?.value}/>
			<InfoPageTableEntry title="Modes" value={game.modes?.value.split("|")}/>
			<InfoPageTableEntry title="IGN score" value={game.IGN?.value}/>
			<InfoPageTableEntry title="Game engine" value={game.gameEngines?.value}/>
			<InfoPageTableEntry title="Series" value={game.series?.value}/>
		</ul>

		<div slot="content">
			<div class="grid xl:grid-cols-2 gap-x-8 gap-y-8 mt-10">		
				<SmallList title="Publishers" type="company" promise={searchList("publisher", data.slug)}/>
				<SmallList title="Developers" type="company" promise={searchList("developer", data.slug)}/>
				<SmallList title="Genres" type="genre" promise={searchList("genre", data.slug)}/>
				<SmallList title="Platforms" type="platform" promise={searchList("computingPlatform", data.slug, 0)}/>
			</div>
			<CardList title="Popular games of the same genre" type="game" promise={searchGamesByGenre(data.slug)}/>
		</div>
	</InfoPage>

{:catch error}
	<p>{error}</p>
{/await}
