<template lang="pug">
main.main 
    .main__container 
        Search
        SearchBlock(
            v-if="getTraveler !== null"
            :traveler="getTraveler"
            )
</template>

<script lang="ts">
import Search from "@/components/Main/Search.vue"
import SearchBlock from "@/components/Main/SearchBlock.vue"
import {mapGetters} from "vuex"
export default {
components: {
    Search,
    SearchBlock
},
computed: {
    ...mapGetters(["getTraveler"])
}
}
</script>

<style >

</style>