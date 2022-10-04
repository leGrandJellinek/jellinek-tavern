<template lang="pug">
main.main 
    .main__container 
        Search
        .main__container-result(v-if="getTraveler !== null")
            SearchBlock(
            :traveler="getTraveler"
            )
            Character(
            v-for="char in getTraveler.characters" 
            :key="char.id"
            :char="char")
</template>

<script lang="ts">
import Search from "@/components/Main/Search.vue"
import SearchBlock from "@/components/Main/SearchBlock.vue"
import Character from "@/components/Main/Character.vue"
import { defineComponent } from "@vue/runtime-core"
import {mapGetters} from "vuex"
export default defineComponent({
components: {
    Search,
    SearchBlock,
    Character
},
computed: {
    ...mapGetters(["getTraveler"])
}
})
</script>

<style lang="sass" scoped>
.main__container-result
    display: flex
    flex-direction: column
    gap: 30px
</style>

