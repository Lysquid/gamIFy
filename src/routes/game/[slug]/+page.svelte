<script lang="ts">
	import type { PageData } from './$types';
	
	export let data: PageData;
</script>


<h1 class="text-2xl">{data.game.title.value}</h1>

<p>{data.game.description.value}</p>
