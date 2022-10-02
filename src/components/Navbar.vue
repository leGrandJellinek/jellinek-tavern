<template lang="pug">
nav.header__nav
    .header__nav-container
        a.logo(href="")
            img(src="@/assets/images/logo.png")
        ul.header__nav-menu
            li(v-for="link in getMenuList" :key="link.id")
                router-link.header__nav-link(:to="link.page") {{link.title}}
            li 
                a.header__nav-link(href="#!") Еще


</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"
import {mapGetters} from "vuex"
export default defineComponent({
    computed: {
        ...mapGetters(["getMenuList"])
    }
})
</script>

<style lang="sass" scoped>
.logo 
    & img
        width: 65px
        height: 65px
</style>