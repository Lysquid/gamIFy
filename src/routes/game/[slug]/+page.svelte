<script lang="ts">
	import type { PageData } from './$types';
	
	export let data: PageData;
</script>

{#each data.results.bindings as game}
    {game.gamelabel.value}
{/each}