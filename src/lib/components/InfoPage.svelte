<script lang="ts">
	import { searchImage } from "$lib/requests";
	import { onMount } from "svelte";

	export let title: string;
	export let description: string;
	export let image: string|undefined;	
</script>

<div class="w-full lg:w-2/3 m-auto flex flex-col-reverse md:flex-row justify-between space-x-10 space-y-10">
	<div class="mr-auto w-full lg:w-2/3">
		<h1 class="text-bold text-5xl mb-10">{title}</h1>
		<p class="text-justify mb-10">{description}</p>
		<slot name="content"/>
	</div>
	<div class="w-full lg:w-1/3">
		<table class="w-full sticky top-32">
			{#if image}
				{#await searchImage(image) then image}
					<tr>
						<td colspan="2" class="px-5 pb-3">
							<img class="rounded-lg max-w-5" src={image} alt="logo" />
						</td>
					</tr>
				{/await}
			{/if}
			<slot name="info-entry"/>
		</table>
	</div>
</div>
