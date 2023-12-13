<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchImage, searchPublisherInfo } from '$lib/requests';
	import { Spinner, A } from 'flowbite-svelte';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';

	export let data: PageData;
	let loading = true;
	let publisher_data: any = null;

	onMount(async () => {
		loading = true;
		publisher_data = (await searchPublisherInfo(data.slug)).results.bindings[0];
		console.log(publisher_data);

		if (publisher_data.image) {
			publisher_data.image = await searchImage(publisher_data.image.value);
		}

		loading = false;
	});
</script>

<div class="p-5">
	{#if loading}
		<Spinner></Spinner>
	{:else if publisher_data}
		<InfoPage
			title={publisher_data?.publisherlabel?.value || ''}
			description={publisher_data?.description?.value || ''}
			image={publisher_data?.image}
		>
		<div slot="info-entry"> 
			{#if publisher_data?.foundingDate?.value}
				<InfoPageTableEntry
					title="Founding date"
				>	
					<p>{publisher_data?.foundingDate?.value}</p>
				</InfoPageTableEntry>
			{/if}
			{#if publisher_data?.founderName?.value}
				<InfoPageTableEntry
					title="Founder"
				>	
					<p>{publisher_data?.founderName?.value}</p>
				</InfoPageTableEntry>
			{/if}
			{#if publisher_data?.foundersPeople?.value}
				<InfoPageTableEntry
					title="Founders"
				>	
					<ul class="list-disc">
						{#each publisher_data?.foundersPeople?.value.split("|").filter(s => s.trim()) as people}
							<li>{people}</li>
						{/each}
					</ul>
				</InfoPageTableEntry>
			{/if}
			{#if publisher_data?.keyPeople?.value}
				<InfoPageTableEntry
					title="Key people"
				>
					<ul class="list-disc">
						{#each publisher_data?.keyPeople?.value.split("|").filter(s => s.trim()) as people}
							<li>{people}</li>
						{/each}
					</ul>
				</InfoPageTableEntry>
			{/if}
			{#if publisher_data?.citylabel?.value}
				<InfoPageTableEntry
					title="Headquarters"
				>
					<p>{publisher_data?.citylabel?.value}</p>
				</InfoPageTableEntry>
			{/if}
			{#if publisher_data?.emp?.value}
				<InfoPageTableEntry
					title="Number of employees"
				>
					<p>{publisher_data?.emp?.value}</p>
				</InfoPageTableEntry>
			{/if}
			{#if publisher_data?.homepage?.value}
				<InfoPageTableEntry
					title="Website"
				>
					<A href={publisher_data?.homepage?.value}>{publisher_data?.homepage?.value}</A>
				</InfoPageTableEntry>
			{/if}
		</div>
		</InfoPage>
	{:else}
		Not found
	{/if}
</div>
