<template lang="pug">
header.header
    Navbar
</template>

<script lang="ts">
import Navbar from "@/components/Navbar.vue"
import { defineComponent } from "@vue/runtime-core"

export default defineComponent({
    components: {
        Navbar
    }
})
</script>

<style>

</style>