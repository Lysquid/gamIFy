<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchImage, searchGenreInfo, searchGamesByGenreURI } from '$lib/requests';
	import { Spinner } from 'flowbite-svelte';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';
	import SmallListBox from '$lib/components/SmallListBox.svelte';

	export let data: PageData;
	let loading = true;
	let genre_data: any = null;
	let games: null | any;

	onMount(async () => {
		loading = true;
		genre_data = (await searchGenreInfo(data.slug))[0];
		console.log(genre_data);

		if (genre_data.image) {
			genre_data.image = await searchImage(genre_data.image.value);
		}

		loading = false;
	});

	onMount(async () => {
		games = (await searchGamesByGenreURI(data.slug));
        console.log(games);
	});
</script>

{#if loading}
	<Spinner color="blue"></Spinner>
{:else if genre_data}
	<InfoPage
		title={genre_data?.label?.value || ''}
		description={genre_data?.description?.value || ''}
		image={genre_data?.image}
	>
		<div slot="info-entry">
			<InfoPageTableEntry title="Game count">
				<p>{genre_data?.gamecount?.value}</p>
			</InfoPageTableEntry>
			{#if genre_data?.createdDate?.value}
				<InfoPageTableEntry title="Creation date">
					<p>{genre_data?.createdDate?.value}</p>
				</InfoPageTableEntry>
			{/if}
		</div>
		<div slot="content" class="mt-10">
			{#if games?.length}
				<div>
					<h1 class="text-3xl">Popular games of this genre</h1>
					{#each games as game}
						<SmallListBox
							name={game.gamelabel.value}
							type="game"
							uri={game.game.value}
							image={game.image?.value}
						/>
					{/each}
				</div>
			{/if}
		</div>
	</InfoPage>
{:else}
	Not found
{/if}
