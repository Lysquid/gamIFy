<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchPlatformInfos, searchGames, AttributeFilter } from '$lib/requests';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import { Spinner } from 'flowbite-svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';
	import ListBox from '$lib/components/ListBox.svelte';
	
	export let data: PageData;
	let platform = searchPlatformInfos(data.slug);
	let games: Promise<any>;
		
	onMount(async () => {
		platform = searchPlatformInfos(data.slug);
		let filters = [new AttributeFilter("computingPlatform", data.slug)];
		games = searchGames(filters, "IGN", 10, 0);
	});

</script>

{#await platform}
	<Spinner color="blue"></Spinner>
{:then platform}

	<InfoPage title={platform.label?.value} description={platform.description?.value} image={platform.image?.value}>
		
		<ul slot="info-entry">
			<InfoPageTableEntry title="Release date" value={platform.date?.value}/>
			<InfoPageTableEntry title="Number of games" value={platform.nb_games?.value}/>
		</ul>

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
