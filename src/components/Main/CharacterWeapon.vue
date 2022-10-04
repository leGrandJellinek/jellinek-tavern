<template lang="pug">
.character__weapon
    .character__weapon-img 
        img(:src="char.weapon.icon")
    .character__weapon-info 
        h2.character__weapon-name {{char.weapon.name}}
        .character__weapon-stats
            .character__weapon-statblock
                .character__weapon-icon.stat-atk
                h2.character__weapon-atk {{char.weapon.mainStat.statValue}}
            .character__weapon-statblock
                h2.character__weapon-stat {{char.weapon.subStat.statValue}}%
        .character__weapon-lvlblock
            h2.character__weapon-r
            h2.character__weapon-lvl  Уровень
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    props:{
        char: Object
    }
})
</script>

<style lang="sass" scoped>
.character
    &__weapon
        display: flex
        gap: 10px
        &-img 
            & img
                width: 87px
                height: 87px 
        &-icon
            background: url("@/assets/icons/icons-stats.png ")
            background-repeat: no-repeat
            background-size: 100px 80px
            height: 20px
            width: 20px
            &.stat-atk
                background-position: -20px 0


</style>
