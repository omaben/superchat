import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import chat from './modules/chat'
import group from "./modules/group";
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		app,
		user,
		chat,
		group,
	},
	getters,
});

export default store
