<script lang="ts">
	export let title: string;
</script>

<tr>
	<td class="px-5 py-3"><strong>{title}</strong></td>
	<td class="pe-5 py-3">
		<slot />
	</td>
</tr>
