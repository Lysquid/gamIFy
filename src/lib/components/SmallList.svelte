<script lang="ts">
	import SmallListBox from "./SmallListBox.svelte";
    export var title: string;
    export var type: string;
    export var promise: Promise<any>;
</script>

{#await promise then result}
    {#if result.length > 0}
        <div>
            <h1 class="text-3xl">{title}</h1>
            {#each result as element}
                <SmallListBox name={element.label.value} type="{type}" uri={element.uri.value} image={element.image?.value}/>
            {/each}
        </div>
    {/if}
{/await}