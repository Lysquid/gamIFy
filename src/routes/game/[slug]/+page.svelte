<script lang="ts">
	import type { PageData } from './$types';
	
	export let data: PageData;
</script>

{#each data.games as game}
    {game.gamelabel.value}
{/each}