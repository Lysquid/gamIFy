<script context="module" lang="ts">
    export type ListBoxDataType = {
        title: string, 
        description?: string, 
        image?: string, 
        uri: string
    };
    
</script>

<script lang="ts">

    import { searchImage } from '$lib/requests';
    import { onMount } from 'svelte';

    export var title:string;
    export var description:string|undefined = undefined;
    export var type:string;
    export var uri:string;
    export var image:string|undefined;

    onMount(async () => {
        if (image) {
            image = await searchImage(image);
        }
	});

</script>


<a href="/{type}/{encodeURIComponent(uri.split('/').slice(-1)[0])}" class="flex bg-white hover:bg-gray-50 shadow-lg dark:bg-gray-700 dark:hover:bg-gray-600 h-32 gap-5 rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer">
    {#if image}
        <img class="w-32 object-contain" src="{image}" alt=""/>
    {:else}
        <div class="w-32 object-contain"></div>
    {/if}
    <div class="my-auto w-96">
        <h1 class="text-xl">{title}</h1>
        {#if description}
            <p class="dark:text-gray-400 text-gray-600">{@html description}</p>
        {/if}
    </div>
</a>
