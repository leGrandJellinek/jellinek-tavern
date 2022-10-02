<template lang="pug">
.main__search-block 
    .main__search-traveler
        .main__search-avatar
            img(:src="traveler.player.profilePicture.icon")
        .main__search-info 
            h2.main__search-name {{traveler.player.nickname}}
            .main__search-lvls
                p.main__search-AR Ранг Приключений {{traveler.player.level}}
                p.main__search-WL Уровень Мира {{traveler.player.worldLevel}}
            p.main__search-descr {{traveler.player.signature}}
    .main__search-characters
        .main__search-character(
            v-for="char in traveler.characters"
            :key="char.id")
            .main__search-charicon(:class="{rarityfive: char.rarity === 5}")
                img(:src="char.icons.avatar")
            p.main__search-charlvl {{char.level}}
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"

export default defineComponent({
props: {
    traveler: Object
}
})
</script>
