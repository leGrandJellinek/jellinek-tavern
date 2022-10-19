<template lang="pug">
.character__stats
    .character__stat
        .character__stat-block
            .stat-img.stat-hp(src="@/assets/icons/icons-stats.png")
            p.character__stat-text Макс. HP
        p.character__stat-info
    .character__stat
        .character__stat-block
            .stat-img.stat-atk(src="@/assets/icons/icons-stats.png")
            p.character__stat-text Сила атаки
        p.character__stat-info
    .character__stat
        .character__stat-block
            .stat-img.stat-def(src="@/assets/icons/icons-stats.png")
            p.character__stat-text Защита 
        p.character__stat-info
    .character__stat
        .character__stat-block
            .stat-img.stat-em(src="@/assets/icons/icons-stats.png")
            p.character__stat-text Мастерство стихий
        p.character__stat-info
    .character__stat
        .character__stat-block
            img.stats-icon(src="@/assets/icons/crit_rate.svg")
            p.character__stat-text Шанс крит.попадания
        p.character__stat-info
    .character__stat
        .character__stat-block
            img.stats-icon(src="@/assets/icons/crit_damage.svg")
            p.character__stat-text Крит. урон
        p.character__stat-info
    .character__stat
        .character__stat-block
            .stat-img.stat-recharge(src="@/assets/icons/icons-stats.png")
            p.character__stat-text Восс. энергии
        p.character__stat-info
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        char:Object
    }
})
</script>

<style lang="sass">
.character
    &__stats
        display: flex
        flex-direction: column
        gap: 10px
    &__stat
        &-block
            display: flex
            gap: 5px
            & div.stat-img
                background: url("@/assets/icons/icons-stats.png ")
                background-repeat: no-repeat
                background-size: 100px 80px
                height: 20px
                width: 20px
            & div.stat-hp
            & div.stat-atk
                background-position: -20px 0
            & div.stat-def
                background-position: -40px 0
            & div.stat-em
                background-position: -60px 0
            & div.stat-recharge
                background-position: -40px -20px

</style>