<script lang="ts">
	import { A } from "flowbite-svelte";
	export let title: string;
	export let value: string|string[];
	export let url: string|null = null;
</script>

{#if value && (typeof value === "string" || value[0].length > 0)}
	<tr>
		<td class="ps-5 pe-3 py-3"><strong>{title}</strong></td>
		<td class="pe-5 py-3">
			{#if typeof value === "string"}
				{#if url}
					<A href={url}>{value}</A>
				{:else}
					<span>{value}</span>
				{/if}
			{:else}
				<ul class="list-disc ms-4">
					{#each value.filter(s => s.trim()) as element}
						<li>{element}</li>
					{/each}
				</ul>
			{/if}
		</td>
	</tr>		
{/if}