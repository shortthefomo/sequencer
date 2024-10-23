<template>
    <!-- <XummSignin @signin_complete="signinCompleted" /> -->

    <div>
        <main class="mb-4">
            <router-view />
        </main>

        <!-- <footer class="container footer mb-2 mt-auto">
            <div class="border-top py-3 text-light">
                &copy; Trade
                <Refs />
            </div>
        </footer> -->
    </div>
</template>

<script>
import Refs from '../components/Refs.vue'

export default {
    name: 'MainLayout',
    components: {
        Refs
    },
    data() {
        return {
            
            signedIn: true
        }
    },
    methods: {
        signinCompleted(value) {
            this.signedIn = true
        },
    },
}
</script>
