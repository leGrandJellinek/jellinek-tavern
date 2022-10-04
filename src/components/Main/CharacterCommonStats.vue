<template lang="pug">
.main__character-stats   
    CharacterWeapon(:char="char")
    CharacterStats(:char="char")
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CharacterWeapon from "@/components/Main/CharacterWeapon.vue";
import CharacterStats from "@/components/Main/CharacterStats.vue";

export default defineComponent({
    components: {
        CharacterWeapon,
        CharacterStats
    },
    props: {
        char:Object
    }
})
</script>

<style lang="sass" scoped>
.main__character-stats
    
    height: 100%
    display: flex
    flex-direction: column
    gap: 20px
</style>