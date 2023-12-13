<script lang="ts">

    export var name:string;
    export var url:string;
    export var image:string = '';
    export var description:string = '';

</script>

<a href="/game/{encodeURIComponent(url.split('/').slice(-1))}" class="flex bg-white hover:bg-gray-50 shadow-lg dark:bg-gray-700 dark:hover:bg-gray-600 h-32 gap-5 rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer">
    {#if image}
    <img class="w-32 object-contain" src="{image}" alt=""/>
    {:else}
    <div class="w-32 object-contain"></div>
    {/if}
    <div class="my-auto w-96">
        <h1 class="text-xl">{name}</h1>
        {#if description}
            <p class="dark:text-gray-400 text-gray-600">published by <strong>{description}</strong></p>
        {/if}
    </div>
</a>