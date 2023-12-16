<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchPlatformInfos, searchList, searchImage } from '$lib/requests';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import { Spinner } from 'flowbite-svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';
	import SmallListBox from '$lib/components/SmallListBox.svelte';
	
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
		games = (await searchList("computingPlatform", data.slug, 10, true)).results.bindings;
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

			{#if games?.length}
				<div>
					<h1 class="text-3xl">Games</h1>
					{#each games as game}
						<SmallListBox name={game.label.value} type="game" uri={game.uri.value} image={game.image?.value}/>
					{/each}
				</div>
			{/if}
		
		</div>
	</InfoPage>
{:else}
	Not found
{/if}
