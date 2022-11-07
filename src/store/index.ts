import { createStore } from 'vuex'
import {EnkaNetwork} from "enkanetwork"
const enka = new EnkaNetwork({language: "RU", caching: false})
const TimaID = 726865921;
export default createStore({
  state: {
    user: null as any,
    menuList: [
      {
        id:1,
        title: "Обо мне",
        page:"/about",
        icon:".svg"
      },
      {
        id:2,
        title: "Найти игрока",
        page:"/search",
        icon:".svg"
      },
      {
        id:3,
        title: "База",
        page:"/basedate",
        icon:".svg"
      },
    ]
  },
  getters: {
    getMenuList(state):Object[]{
      return state.menuList
    },
    getTraveler(state):Object | null{
      return state.user
    },
  },
  mutations: {
    getUserInfo(state:any, user:any):void{
      for(let i = 0; i < user.characters.length; i++){
        user.characters[i].active = false
      }
      user.characters[0].active = true
      console.log(user);
      state.user = user 
    },
    characterActive(state, id):void{
      for(let i = 0; i < state.user.characters.length; i++){
        const char = state.user.characters[i];
        char.active = false
        if(char.id === id) char.active = true
      }
    }
  },
  actions: {
    async getUserInfo({commit} , UID:string):Promise<void>{
      const user = await enka.fetchUser(+UID, "RU");
      commit("getUserInfo", user)
    },
    async characterActive({commit},id:number):Promise<void>{
      commit("characterActive",id)
    }
  },
  modules: {
  }
})
