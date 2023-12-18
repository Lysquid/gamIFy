<script lang="ts">
	import { searchImage } from '$lib/requests';
    import { onMount } from 'svelte';

    export var name:string;
    export var type:string;
    export var uri:string;
    export var image:string|undefined;

</script>

<a href="../{type}/{encodeURIComponent(uri.split('/').slice(-1)[0])}" class="my-4 w-96 flex items-right flex-col-reverse justify-end bg-white hover:bg-gray-50 shadow-lg dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer w-96">

    <h1 class="text-lg mx-3 my-1">{name}</h1>
    {#if image}
        {#await searchImage(image) then image}
            <img src="{image}" class="h-48 object-cover" alt="logo"/>
        {/await}
    {/if}
</a>
