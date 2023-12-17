<script lang="ts">
	export let title: string;
	export let value: string|undefined = undefined;
</script>

<tr>
	<td class="ps-5 pe-3 py-3"><strong>{title}</strong></td>
	<td class="pe-5 py-3">
		{#if value}
			<span>{value}</span>
		{:else}
			<slot/>
		{/if}
	</td>
</tr>
