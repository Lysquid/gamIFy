<script lang="ts">
	export let title: string;
</script>

<tr>
	<td class="ps-5 pe-2 py-3"><strong>{title}</strong></td>
	<td class="pe-5 py-3">
		<slot />
	</td>
</tr>
