<template lang="pug">
section.main__character(:class="{active: char.active}")
    .main__character-bg
        video(autoplay muted loop repeat)
            source(:src="require(`@/assets/videos/bg/${getElementBG(char.element)}`)")
    .main__character-info 
        .main__character-info-descr 
            h2.main__character-charname {{char.name}}
            p.main__character-charlvl Уровень {{90}}/90
            .main__character-friend-block
                h2.main__character-friend-lvl {{char.friendshipLevel}}
        .main__character-talents
            .main__character-skills
                .main__character-skill(v-for="skill in char.skills " :key="skill.id")
                    img(:src="skill.icon")
                    p.main__character-skill-lvl {{skill.level}} 
            .main__character-constellations
                .main__character-constellation(v-for="constellation in char.constellation" :key="constellation.id")
                    img(:src="constellation.icon")
    .main__character-common-stats
        CharacterCommonStats(
            :char="char"
        )
    .main__character-artefacts
        CharacterArtefact(
        v-for="artefact in char.reluquary" 
        :key="artefact.id"
        :artefact="artefact")
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import CharacterArtefact from "@/components/Main/CharacterArtefact.vue"
import CharacterCommonStats from "@/components/Main/CharacterCommonStats.vue"
export default defineComponent({
    props:{
        char: Object,
    },
    components: {
        CharacterArtefact,
        CharacterCommonStats
    },
    methods: {
       getElementBG(element:string):string{
            if(element === "Piro" || element === "Pyro"){
                return "bg_pyro.webm";
            }else if(element === "Hydro"){
                return "bg_hydro.webm";
            }else if(element === "Electro"){
                return "bg_electro.webm";
            }else if(element === "Anemo"){
                return "bg_anemo.webm";
            }else if(element === "Cryo"){
                return "bg_cryo.webm";
            }else if(element === "Geo"){
                return "bg_geo.webm";
            }else if(element === undefined || element === "Dendro"){
                return "bg_dendro.webm"
            }
            else {
                return "";
            }
       } 
    }
})
</script>
