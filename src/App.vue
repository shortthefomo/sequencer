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

    body.front #data-feed-switch {
        opacity: 100%;
    }

    body.front #data-feed-switch {
        cursor: pointer;
    }
    body.front #data-feed-switch i {
        margin-right: 10px;
    }

    body.front {
        margin:  0;
    }
    .l-navbar a {
        text-decoration: none;
    }

    .header {
        width: 100%;
        height: var(--header-height);
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        background-color: rgba(255, 255, 255, 0.02);
        z-index: var(--z-fixed);
        transition: .5s
    }

    .header_toggle {
        color: var(--menu-bar-color);
        font-size: 1.5rem;
        cursor: pointer
    }

    .header_img {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        border-radius: 50%;
        overflow: hidden;
    }

    .header_img img {
        width: 45px
    }

    .l-navbar {
        position: fixed;
        top: 0;
        left: -30%;
        width: var(--nav-width);
        height: 100vh;
        background-color: var(--menu-bar-color);
        padding: .5rem 1rem 0 0;
        transition: .5s;
        z-index: var(--z-fixed);
    }

    .navbar {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start !important;
        justify-content: space-between;
        overflow: hidden;
    }

    .nav_logo,
    .nav_link {
        display: grid;
        grid-template-columns: max-content max-content;
        align-items: center;
        column-gap: 1rem;
        padding: .5rem 0 .5rem 1.5rem;
    }

    .nav_logo {
        margin-bottom: 2rem;
    }

    .nav_logo-icon {
        font-size: 1.25rem;
        color: var(--white-color);
    }

    .nav_logo-name {
        color: var(--white-color);
        font-weight: 700
    }

    .nav_link {
        position: relative;
        color: var(--white-color);
        margin-bottom: 1.5rem;
        transition: .3s
    }

    .nav_link:hover {
        color: var(--first-color);
    }

    .nav_icon {
        font-size: 1.25rem;
        margin-right: 5px;
    }

    .show-nav {
        left: 0;
    }

    .body-pd {
        padding-left: calc(var(--nav-width) + 1rem);
    }

    #mybod {
        margin: calc(var(--header-height) + 1.5rem) 0 0 0;
    }

    .active {
        color: var(--first-color);
    }

    .active::before {
        content: '';
        position: absolute;
        left: 0;
        width: 2px;
        height: 32px;
        background-color: var(--white-color);
    }

    .height-100 {
        height: 100vh;
    }

    @media screen and (min-width: 768px) {
        body {
            margin: calc(var(--header-height) + 1rem) 0 0 0;
            padding-left: calc(var(--nav-width) + 0.2rem);
            overflow-x: hidden;
        }

        .header {
            height: calc(var(--header-height) + 1rem);
            padding: 0 2rem 0 calc(var(--nav-width) + 2rem);
        }

        .header_img {
            width: 40px;
            height: 40px;
        }

        .header_img img {
            width: 45px;
        }

        .nav_icon {
            margin-top: -5px;
        }

        .l-navbar {
            left: 0;
            padding: 1rem 1rem 0 0;
        }

        .show-nav {
            width: calc(var(--nav-width) + 156px);
        }

        .body-pd {
            padding-left: calc(var(--nav-width) + 188px);
        }
    }
</style>