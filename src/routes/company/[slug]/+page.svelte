<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { AttributeFilter, searchGames, searchPublisherInfo } from '$lib/requests';
	import { Spinner } from 'flowbite-svelte';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';
	import ListBox from '$lib/components/ListBox.svelte';

	export let data: PageData;
	let publisher: Promise<any> = searchPublisherInfo(data.slug);
	let games: Promise<any>;

	onMount(async () => {
		publisher = searchPublisherInfo(data.slug);
		let filters = [new AttributeFilter("publisher", data.slug)];
		games = searchGames(filters, "wikiPageLength", 10, 0);
	});

</script>

{#await publisher}
	<Spinner color="blue"></Spinner>
{:then publisher}

	<InfoPage title={publisher.label.value} description={publisher.description?.value} image={publisher?.image.value}>

		<div slot="info-entry"> 
			<InfoPageTableEntry title="Founding date" value={publisher.foundingDate?.value}/>	
			<InfoPageTableEntry title="Founder" value={publisher.founderName?.value}/>
			<InfoPageTableEntry title="Founders" value={publisher.foundersPeople?.value.split("|")}/>
			<InfoPageTableEntry title="Key people" value={publisher.keyPeople?.value.split("|")}/>
			<InfoPageTableEntry title="Headquarters" value={publisher.citylabel?.value}/>
			<InfoPageTableEntry title="Number of employees" value={publisher.emp?.value}/>
			<InfoPageTableEntry title="Website" value={publisher.homepage?.value} url={publisher.homepage?.value}/>
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
