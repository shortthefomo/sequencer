<template>
    <!-- <XummSignin @signin_complete="signinCompleted" /> -->

    <div>
        <Nav />

        <main class="flex-shrink-0 mb-4">
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
import Nav from '../components/Nav.vue'
import Refs from '../components/Refs.vue'

export default {
    name: 'MainLayout',
    components: {
        Nav,
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
