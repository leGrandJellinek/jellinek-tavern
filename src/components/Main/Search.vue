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
import {mapActions} from "vuex"
export default {
    data(){
        return {
            search: ""
        }
    },
    methods: {
        ...mapActions(["getUserInfo"]),
        searchUser(){
            this.getUserInfo(this.search);
            this.search = ""
        }
    }
}
</script>
