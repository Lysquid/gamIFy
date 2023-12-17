<script lang="ts">
	import type { PageData } from './$types';
	import { AttributeFilter, searchPublisherInfo } from '$lib/requests';
	import { Spinner } from 'flowbite-svelte';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';
	import SortedGameList from '$lib/components/SortedGameList.svelte';
	export let data: PageData;
</script>

{#await searchPublisherInfo(data.slug)}
	<Spinner color="blue"></Spinner>
{:then publisher}

	<InfoPage title={publisher.label.value} description={publisher.description?.value} image={publisher?.image.value}>

		<div slot="info-entry"> 
			<InfoPageTableEntry title="Founding date" value={publisher.foundingDate?.value}/>	
			<InfoPageTableEntry title="Founder" value={publisher.founderName?.value}/>
			<InfoPageTableEntry title="Founders" value={publisher.foundersPeople?.value.split("|")}/>
			<InfoPageTableEntry title="Key people" value={publisher.keyPeople?.value.split("|")}/>
			<InfoPageTableEntry title="Headquarters" value={publisher.city?.value}/>
			<InfoPageTableEntry title="Number of employees" value={publisher.numberOfEmployees?.value}/>
			<InfoPageTableEntry title="Website" value={publisher.homepage?.value} url={publisher.homepage?.value}/>
		</div>

		<div slot="content">
			<SortedGameList filter={new AttributeFilter("publisher", data.slug)}/>
		</div>
	</InfoPage>

{:catch error}
	<p>{error}</p>
{/await}
