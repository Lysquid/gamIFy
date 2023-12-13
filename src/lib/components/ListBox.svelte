<script lang="ts">

    export var data: {title: string, description?: string, image?: string, url: string}[];

</script>

<div class="flex flex-col mx-50 gap-5 mt-10 items-center">
    {#each data as item}
        <a class="flex bg-white hover:bg-gray-50 shadow-lg dark:bg-gray-700 dark:hover:bg-gray-600 h-32 gap-5 rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer">
            {#if item.image}
                <img class="w-32 object-contain" src="{item.image.value}" alt=""/>
            {:else}
                <div class="w-32 object-contain"></div>
            {/if}
            <div class="my-auto w-96">
                <h1 class="text-xl">{item.title.value}</h1>
                {#if item.description}
                    <p class="dark:text-gray-400 text-gray-600">{item.description.value}</p>
                {/if}
            </div>
        </a>
    {/each}
</div>
