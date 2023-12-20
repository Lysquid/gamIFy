<script lang="ts">
	import CardListBox from "$lib/components/CardListBox.svelte";
    export var title: string;
    export var type: string;
    export var promise: Promise<any>;
</script>

{#await promise then result}
    {#if result.length > 0}
        <h1 class="text-3xl mt-8">{title}</h1>
            <div class="flex flex-row space-x-5 flex-nowrap">
                {#each result as element}
                    <CardListBox name={element.label.value} type="{type}" uri={element.uri.value} image={element.image?.value}/>
                {/each}
        </div>
    {/if}
{/await}
