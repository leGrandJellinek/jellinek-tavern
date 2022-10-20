<template lang="pug">
nav.header__nav
    .header__nav-container
        a.logo(href="")
            img(src="@/assets/images/logo.png")
        ul.header__nav-menu(:class="{active: burger}")
            li(v-for="link in getMenuList" :key="link.id")
                router-link.header__nav-link(:to="link.page") {{link.title}}
            li 
                a.header__nav-link(href="#!") Еще
            li
                button.header__nav-close(@click="closeBurger")
                    i.fa-solid.fa-xmark
        button.header__nav-btn(@click="openBurger")
            i.fa-solid.fa-bars


</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"
import {mapGetters} from "vuex"
export default defineComponent({
    data(){
        return {
            burger: false
        }
    },
    computed: {
        ...mapGetters(["getMenuList"])
    },
    methods: {
        openBurger(){
            this.burger = !this.burger
            const body: any = document.querySelector("body");
            body.style = `overflow:hidden;`;
        },
        closeBurger(){
            this.burger = !this.burger
            const body: any = document.querySelector("body");
            body.style = `overflow: visible;`;
        }
    }
})
</script>

<style lang="sass" scoped>
.logo 
    & img
        width: 65px
        height: 65px
</style>