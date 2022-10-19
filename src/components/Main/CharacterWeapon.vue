<template lang="pug">
.character__weapon
    .character__weapon-img 
        img.weapon(:src="char.weapon.icon")
        img.stars(:src="require(`@/assets/icons/${getWeaponStar(char.weapon.rarity)}`)")
    .character__weapon-info 
        h2.character__weapon-name {{char.weapon.name}}
        .character__weapon-stats
            .character__weapon-stats-block
                .character__weapon-icon.stat-atk
                h2.character__weapon-atk {{char.weapon.mainStat.statValue}}
            .character__weapon-stats-block
                h2.character__weapon-stat {{char.weapon.subStat.statValue}}%
        .character__weapon-lvlblock
            h2.character__weapon-r R{{char.weapon.improvement}}
            h2.character__weapon-lvl  Уровень {{char.weapon.level}}/
                span 90
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    props:{
        char: Object
    },
    methods: {
        getWeaponStar(rarity:number):string{
            if(rarity === 5){
                return "five_star.png";
            }else if(rarity === 4){
                return "four_star.png";
            }else if(rarity === 3){
                return "three_star.png";
            }else if(rarity === 2){
                return "two_star.png";
            }else if(rarity === 1){
                return "one_star.png"
            }else {
                return ""
            }
        }
    }
})
</script>

<style lang="sass">
.character
    &__weapon
        display: flex
        align-items: center
        flex-wrap: wrap
        gap: 10px
        &-info 
            display: flex
            flex-direction: column
            gap: 8px
        &-name 
            font-size: 108%
            line-height: 1.3
            font-weight: 400
        &-img
            display: flex   
            flex-direction: column
            & img.weapon
                width: 87px
                height: 87px
            & img.stars
                    height: 23px
                    width: 84px 
                
        &-icon
            background: url("@/assets/icons/icons-stats.png ")
            background-repeat: no-repeat
            background-size: 100px 80px
            height: 20px
            width: 20px
            &.stat-atk
                background-position: -20px 0
        &-stats 
            display: flex
            gap: 20px
            &-block 
                display: flex
                align-items: center
                gap: 5px
                background: rgba(255,255,255,.15)
                padding: 5px
                border-radius: 5px
        &-atk , &-stat
            font-size: 17px
            line-height: 1.3
            font-weight: 500
        &-lvlblock 
            display: flex
            gap: 10px
        &-r , &-lvl
            border-radius: 0.2em
            text-shadow: 0 0.1em 0.1em rgb(0 0 0 / 40%)
            background: rgba(0,0,0,.5)
            padding: 5px
            line-height: 1
            font-weight: 400
            font-size: 17px
        &-lvl
            & span 
                opacity: 0.6


</style>
