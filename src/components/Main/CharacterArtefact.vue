<template lang="pug">
.main__character-artefact
    .main__artefact-left
        img.artefact-img(:src="artefact.icon")
        .main__artefact-mainstats
            img(src="")
            p.main__artefact-mainstat
            p.main__artefact-lvl
    .main__artefact-right
        .main__artefact-block
            .main__artefact-item
                img(src="")
                p.main__artefact-item-stat
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        artefact: Object
    }
})
</script>

<style lang="sass" scoped>

</style>
