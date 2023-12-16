<script>import "../app.pcss";</script>

<div class="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen flex flex-col justify-between">
    <a class="bg-gradient-to-r from-cyan-500 to-emerald-500 text-center p-5 text-3xl text-white font-bold fixed w-full z-50" href="/">GamIFy</a>
    <div class="mb-auto mt-20">
        <slot></slot>
    </div>
    <footer class="mt-10 bg-gradient-to-r from-cyan-500 to-emerald-500">
        <p class="p-1 text-1xl text-white text-right pr-3">Developped by <strong>Blazanome©</strong></p>
    </footer>
</div>
