<script lang="ts">
	export let title: string;
</script>

<tr>
	<td class="p-5"><strong>{title}</strong></td>
	<td class="p-5">
		<slot />
	</td>
</tr>
