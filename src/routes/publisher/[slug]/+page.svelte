<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchImage, searchPublisherInfo } from '$lib/requests';
	import { Spinner } from 'flowbite-svelte';

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
			<div class="mr-auto w-3/4">
				<h1 class="text-bold text-5xl mb-10">{publisher_data?.publisherlabel?.value}</h1>
                <p class="text-justify">{publisher_data?.description?.value || ''}</p>
			</div>
			{#if publisher_data.image}
				<img class="w-1/4" src={publisher_data.image} alt="Publisher logo" />
			{/if}
		</div>
	{:else}
		Not found
	{/if}
</div>
