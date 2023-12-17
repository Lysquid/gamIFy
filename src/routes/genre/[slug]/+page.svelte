<script lang="ts">
	import type { PageData } from './$types';
	import { searchGenreInfo, AttributeFilter } from '$lib/requests';
	import { Spinner } from 'flowbite-svelte';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';
	import SortedGameList from '$lib/components/SortedGameList.svelte';
	export let data: PageData;
</script>

{#await searchGenreInfo(data.slug)}
	<Spinner color="blue"></Spinner>
{:then genre}

	<InfoPage title={genre.label.value} description={genre.description?.value} image={genre.image?.value}>
		
		<div slot="info-entry">
			<InfoPageTableEntry title="Game count" value={genre.gamecount?.value}/>
			<InfoPageTableEntry title="Creation date" value={genre.createdDate?.value}/>
		</div>

		<div slot="content">
			<SortedGameList filter={new AttributeFilter("genre", data.slug)}/>
		</div>
	</InfoPage>

{:catch error}
	<p>{error}</p>
{/await}
