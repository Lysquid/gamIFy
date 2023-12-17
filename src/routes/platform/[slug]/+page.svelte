<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchPlatformInfos, searchGames, searchImage, AttributeFilter } from '$lib/requests';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import { Spinner } from 'flowbite-svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';
	import ListBox, { type ListBoxDataType } from '$lib/components/ListBox.svelte';
	
	export let data: PageData;
	let platform: null | any;
	let games: null | any;
	let loading: boolean = true;

	onMount(async () => {
		const results = await searchPlatformInfos(data.slug);
		platform = results.results.bindings[0];
		if (platform.image) {
			platform.image.value = await searchImage(platform.image.value);
		}
		loading = false;
	});

	onMount(async () => {
		// games = (await searchGamesBy("computingPlatform', data.slug)).results.bindings;
		let filters = [new AttributeFilter("computingPlatform", data.slug)];
		const res = (await searchGames(filters, "IGN", 10, 0))?.results.bindings;
		if (!res) {
			games = undefined;
		} else {
            games = await Promise.all(res.map(async (el: any): Promise<ListBoxDataType> => { return {
                    url: `/game/${encodeURIComponent(el.game.value.split('/').slice(-1))}`, 
                    title: el.gamelabel.value,
                    description: el.publisherlabel.value != "" ? `Published by : <strong>${el.publisherlabel.value}</strong>`: undefined,
                    image: el.image ? await searchImage(el.image.value) : undefined,
            }}));
		}
	});

</script>


{#if loading}
	<Spinner color="blue"></Spinner>
{:else if platform}
	<InfoPage
		title={platform.label?.value || ''}
		description={platform.description?.value || ''}
		image={platform.image?.value || ''}
	>
		<ul slot="info-entry">
			{#if platform.date}
				<InfoPageTableEntry title="Release date">
					{platform.date.value}
				</InfoPageTableEntry>
			{/if}
			{#if platform.nb_games}
				<InfoPageTableEntry title="Number of games">
					{platform.nb_games.value}
				</InfoPageTableEntry>
			{/if}
		</ul>


		<div slot="content" class="grid xl:grid-cols-2 gap-x-8 gap-y-8 mt-10">

			{#if games}
				<div>
					<h1 class="text-3xl">Games</h1>
					<ListBox data={games}></ListBox>
					{#each games as game}
						<!-- <SmallListBox name={game.label.value} type="game" uri={game.uri.value} image={game.image?.value}/> -->
					{/each}
				</div>
			{/if}
		
		</div>
	</InfoPage>
{:else}
	Not found
{/if}
