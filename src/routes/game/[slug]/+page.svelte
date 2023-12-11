<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { searchGameInfo } from '$lib/requests';

	export let data: PageData;
	let game;

	onMount(async () => {
		try {
			const results = await searchGameInfo(data.slug);
			// Assuming results is an object with the expected structure
			// Update the game variable with the result
			game = results.results.bindings[0];
		} catch (error) {
			console.error('Error fetching game information:', error);
			// Handle errors as needed
		}
	});
</script>

<h1 class="text-2xl">{data.slug}</h1>

{#if game}
	<p>{game.description.value}</p>
{:else}
	<p>Loading...</p>
{/if}
