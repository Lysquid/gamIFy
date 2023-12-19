<script lang="ts">
	import type { PageData } from './$types';
	import { searchPlatformInfos, AttributeFilter } from '$lib/requests';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import { Spinner } from 'flowbite-svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';
	import SortedGameList from '$lib/components/SortedGameList.svelte';
	export let data: PageData;
</script>

{#await searchPlatformInfos(data.slug)}
	<Spinner color="blue"></Spinner>
{:then platform}

	<InfoPage title={platform.label?.value || ""} description={platform.description?.value || ""} image={platform.image?.value}>
		
		<ul slot="info-entry">
			<InfoPageTableEntry title="Release date" value={platform.date?.value}/>
			<InfoPageTableEntry title="Developer" value={platform.developers?.value}/>
			<InfoPageTableEntry title="Number of games" value={platform.nbGames?.value}/>
		</ul>

		<div slot="content">
			<SortedGameList filter={new AttributeFilter("computingPlatform", data.slug)}/>
		</div>
	</InfoPage>

{:catch error}
	<p>{error}</p>
{/await}
