<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchImage, searchGenreInfo } from '$lib/requests';
	import { Spinner } from 'flowbite-svelte';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import InfoPageTableEntry from '$lib/components/InfoPageTableEntry.svelte';

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
		<InfoPage
			title={genre_data?.label?.value || ''}
			description={genre_data?.description?.value || ''}
			image={genre_data?.image}
		/>
	{:else}
		Not found
	{/if}
</div>
