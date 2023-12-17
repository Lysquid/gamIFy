<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchGenreInfo, searchGames, AttributeFilter } from '$lib/requests';
	import { Spinner } from 'flowbite-svelte';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';
	import ListBox from '$lib/components/ListBox.svelte';

	export let data: PageData;
	let genre: Promise<any> = searchGenreInfo(data.slug);
	let games: Promise<any>;

	onMount(async () => {
		genre = searchGenreInfo(data.slug);
		let filters = [new AttributeFilter("genre", data.slug)];
		games = searchGames(filters, "wikiPageLength", 10, 0);
	});

</script>

{#await genre}
	<Spinner color="blue"></Spinner>
{:then genre}

	<InfoPage title={genre.label.value} description={genre.description?.value} image={genre.image?.value}>
		
		<div slot="info-entry">
			<InfoPageTableEntry title="Game count" value={genre.gamecount?.value}/>
			<InfoPageTableEntry title="Creation date" value={genre.createdDate?.value}/>
		</div>

		<div slot="content" class="mt-10">
			{#await games then games}
				<h1 class="text-3xl">Games</h1>
				<div class="flex flex-col mx-50 gap-5 mt-10">
					{#each games as game}
						<ListBox title={game.label.value} type="game" uri={game.uri.value} image={game.image?.value}></ListBox>
					{/each}
				</div>
			{/await}
		</div>
	</InfoPage>

{:catch error}
	<p>{error}</p>
{/await}
