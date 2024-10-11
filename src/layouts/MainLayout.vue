<template>
    <XummSignin @signin_complete="signinCompleted" />

    <div v-if="signedIn">
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
import XummSignin from '../components/XummSignin.vue'

export default {
    name: 'MainLayout',
    components: {
        Nav,
        Refs,
        XummSignin
    },
    data() {
        return {
            
            signedIn: this.$store.getters.signedIn
        }
    },
    methods: {
        signinCompleted(value) {
            this.signedIn = this.$store.getters.signedIn
        },
    },
}
</script>
