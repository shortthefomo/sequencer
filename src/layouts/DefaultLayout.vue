<template>
    <main class="mb-4">
        <router-view />
    </main>

    <footer class="container footer mb-2 mt-auto">
        <div class="border-top py-3 text-light">
            &copy; Trade
            <Refs />
        </div>
    </footer>
</template>

<script>
import Refs from '../components/Refs.vue'

export default {
    name: 'DefaultLayout',
    components: {
        Refs,
    },
    mounted() {}
}
</script>
