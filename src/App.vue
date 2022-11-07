<template lang="pug">
.wrapper
    Header
    router-view
    Footer

</template>

<script lang="ts">

import Header from "@/components/Header.vue";
import Main from "@/components/Main.vue";
import Footer from "@/components/Footer.vue";
import { defineComponent } from "@vue/runtime-core";
import axios from "axios"
export default defineComponent({
    components: {
        Header,
        Main,
        Footer
    },
    created(){
        (async () => {
            const user = await axios.get("https://enka.network/u/700378769/__data.json")
            console.log(user);
            
        })()
    }
})
</script>

<style lang="sass">

</style>