<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchImage, searchPublisherInfo } from '$lib/requests';
	import { Spinner, A } from 'flowbite-svelte';

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
		<div class="flex flex-row justify-between space-x-10">
			<div class="mr-auto w-1/2">
				<h1 class="text-bold text-5xl mb-10">{publisher_data?.publisherlabel?.value}</h1>
                <p class="text-justify mb-10">{publisher_data?.description?.value || ''}</p>
				<h1 class="text-bold text-2xl">{'Number of employees'}</h1>
				<p class="text-justify mb-5">{publisher_data?.emp?.value}</p>
				<h1 class="text-bold text-2xl">{'Website of the company'}</h1>
				<A class="text-justify mb-5" href={publisher_data?.homepage?.value}>{publisher_data?.homepage?.value}</A>
				<h1 class="text-bold text-2xl">{'Key people'}</h1>
				<p class="text-justify mb-5">{publisher_data?.keyPeople?.value}</p>
				<h1 class="text-bold text-2xl">{'Headquarters'}</h1>
				<p class="text-justify mb-5">{publisher_data?.citylabel?.value}</p>
			</div>
			{#if publisher_data.image}
				<img class="w-1/2" src={publisher_data.image} alt="Publisher logo" />
			{/if}
		</div>
	{:else}
		Not found
	{/if}
</div>
