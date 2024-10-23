<template>
    <component :is="layout" />
</template>

<script>
import DefaultLayout from './layouts/DefaultLayout.vue'
import MainLayout from './layouts/MainLayout.vue'

export default {
    components: {
        DefaultLayout,
        MainLayout
    },
    data() {
        return {
            layout: null
        }
    },
    watch: {
        $route(to) {
            this.layout = to.meta.layout !== undefined ? to.meta.layout : 'DefaultLayout'
        },
    },
    async mounted() {

    },
    methods: {
       
    }
}
</script>

<style>
    .alert-pink {
        --bs-alert-color: #ffffff;
        --bs-alert-bg: #ff0080;
        --bs-alert-border-color: #ff0080;
    }

    .alert-yellow {
        --bs-alert-color: #ffffff;
        --bs-alert-bg: #fcc207;
        --bs-alert-border-color: #fcc207;
    }

    .btn-purple {
        background-color: #753ee2 !important;
        color: #FFF !important;
        --bs-btn-bg: #753ee2;
        --bs-btn-border-color: #753ee2;
        --bs-btn-hover-bg: #753ee2;
        --bs-btn-hover-border-color: #753ee2;
        --bs-btn-active-bg: #753ee2;
        --bs-btn-active-border-color: #753ee2;
        --bs-btn-disabled-bg: #753ee2;
        --bs-btn-disabled-border-color: #753ee2;
    }

    .btn-pink {
        background-color: #FF1A8B !important;
        color: #FFF !important;
        --bs-btn-bg: #FF1A8B;
        --bs-btn-border-color: #FF1A8B;
        --bs-btn-hover-bg: #FF1A8B;
        --bs-btn-hover-border-color: #FF1A8B;
        --bs-btn-active-bg: #FF1A8B;
        --bs-btn-active-border-color: #FF1A8B;
        --bs-btn-disabled-bg: #FF1A8B;
        --bs-btn-disabled-border-color: #FF1A8B;
    }

    .bg-pink {
        background-color: #FF1A8B;
    }
    .bg-purple {
        background-color: #753ee2;
    }
    .bg-green {
        background-color:#00e56a;
    }
    .bg-yellow {
        background-color:#fcc207;
    }
    .bg-blue {
        background-color:#19a3ff;
    }

    :root {
        --header-height: 3rem;
        --header-height-neg:  -3rem;
        --nav-width: 68px;
        --nav-width-neg: -68px;
        --first-color: #000000;
        --menu-bar-color: #8b888f;
        --first-color-light: #AFA5D9;
        --white-color: #F7F6FB;
        --body-font: 'Source Code Pro', monospace !important;
        --normal-font-size: 1rem;
        --z-fixed: 100;
    }

    main {
        z-index: 1;
        position: relative;
    }

    body {
        margin-top: 4rem;
        background-color: rgb(41, 41, 41);
    }
    
    body {
        position: relative;
        margin: var(--header-height) 0 0 0;
        padding: 0;
        font-family: var(--body-font);
        font-size: var(--normal-font-size);
        transition: .5s
    }

</style>