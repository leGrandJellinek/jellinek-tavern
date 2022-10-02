<template lang="pug">
section.main__search
    .main__search-block-input 
        input.main__search-input(
            placeholder="Введите UID игрока"
            v-model="search"
            @keydown.enter="searchUser")
        button.main__search-icon(@click="searchUser")
            i.fa-solid.fa-magnifying-glass
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"
import {mapActions} from "vuex"
export default defineComponent({
    data(){
        return {
            search: "" as string
        }
    },

    methods: {
         ...mapActions(["getUserInfo"]),
        searchUser():void {
            this.getUserInfo(this.search)
            this.search = '';
        },
    }
})
</script>
