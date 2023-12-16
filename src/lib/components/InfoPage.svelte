<script lang="ts">
	export let title: string;
	export let description: string;
	export let image: string;
	console.log($$slots);
</script>

<div class="w-full lg:w-2/3 m-auto flex flex-row justify-between space-x-10">
	<div class="mr-auto w-2/3">
		<h1 class="text-bold text-5xl mb-10">{title}</h1>
		<p class="text-justify">{description || ''}</p>
		<slot name="content"/>
	</div>
	{#if image}
		<div class="w-1/3">
			<table class="w-full sticky top-20">
				<tr>
					<td class="px-5 py-3" colspan="2">
						<img class="rounded-lg w-full" src={image} alt="Publisher logo" />
					</td>
				</tr>
				<slot name="info-entry"/>
			</table>
		</div>
	{/if}
</div>
