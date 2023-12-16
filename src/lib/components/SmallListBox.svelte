<script lang="ts">
	import { searchImage } from '$lib/requests';
    import { onMount } from 'svelte';

    export var name:string;
    export var type:string;
    export var uri:string;
    export var image:string|undefined;

    onMount(async () => {
        if (image) {
            image = await searchImage(image);
        }
	});

</script>

<a href="../{type}/{uri.split('/').slice(-1)}" class="my-4 flex items-center min-h-[2.75em] bg-white hover:bg-gray-50 shadow-lg dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer">

    <h1 class="text-lg flex-grow mx-3 my-1">{name}</h1>
    {#if image}
        <img src="{image}" class="max-w-21 h-11 max-w-[7em]" alt="logo"/>
    {/if}
</a>
