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

export default defineComponent({
    components: {
        Header,
        Main,
        Footer
    }
})
</script>

<style lang="sass">

</style>