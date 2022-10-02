import { createStore } from 'vuex'
import { enkaNetwork } from "enkanetwork";
const enka = new enkaNetwork({language: "RU"});
const TimaID = 726865921;
export default createStore({
  state: {
    user: null,
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
    }
  },
  mutations: {
    getUserInfo(state:any, user:object):void{
      console.log(user);
      state.user = user 
    }
  },
  actions: {
    async getUserInfo({commit} , UID:string):Promise<void>{
      const user = await enka.fetchUser(+UID);
      commit("getUserInfo", user)
    }
  },
  modules: {
  }
})
