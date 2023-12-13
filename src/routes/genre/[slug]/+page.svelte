<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchImage, searchGenreInfo } from '$lib/requests';
	import { Spinner } from 'flowbite-svelte';

	export let data: PageData;
	let loading = true;
	let genre_data: any = null;

	onMount(async () => {
		loading = true;
		genre_data = (await searchGenreInfo(data.slug)).results.bindings[0];
		console.log(genre_data);

		if (genre_data.image) {
			genre_data.image = await searchImage(genre_data.image.value);
		}

		loading = false;
	});
</script>

<div class="p-5">
	{#if loading}
		<Spinner></Spinner>
	{:else if genre_data}
		<div class="flex flex-row justify-between space-x-10">
			<div class="mr-auto w-3/4">
				<h1 class="text-bold text-5xl mb-10">{genre_data?.label?.value}</h1>
                <p class="text-justify">{genre_data?.description?.value || ''}</p>
			</div>
			{#if genre_data.image}
				<img class="w-1/4" src={genre_data.image} alt="Publisher logo" />
			{/if}
		</div>
	{:else}
		Not found
	{/if}
</div>
