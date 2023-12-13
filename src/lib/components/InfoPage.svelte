<script lang="ts">
	export let title: string;
	export let description: string;
	export let image: string;
	console.log(image);
	export let tableInfos: [string, string | string[]][];
</script>

<div class="w-full lg:w-2/3 m-auto flex flex-row justify-between space-x-10">
	<div class="mr-auto w-2/3">
		<h1 class="text-bold text-5xl mb-10">{title}</h1>
		<p class="text-justify">{description || ''}</p>
		<slot />
	</div>
	{#if image}
		<div class="w-1/3">
			<table class="w-full">
				<tr>
					<td class="p-5" colspan="2">
						<img class="rounded-lg w-full" src={image} alt="Publisher logo" />
					</td>
				</tr>
				{#each tableInfos as [title, value]}
					<tr>
						<td class="p-5"><strong>{title}</strong></td>
						<td class="p-5">
							{#if typeof value === 'string'}
								{value}
							{:else}
								<ul class="list-disc">
									{#each value as val}
										<li>{val}</li>
									{/each}
								</ul>
							{/if}
						</td>
					</tr>
				{/each}
			</table>
		</div>
	{/if}
</div>
