import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		directory: []
	},

	mutations: {
		ADD_DIRECTORY(state, newDirectory) {
			state.directory.push(newDirectory);
		},

		EDIT_DIRECTORY(state, directory) {
			const index = state.directory.findIndex(dir => dir.id === directory.id);
			state.directory.splice(index, 1, directory);
		},

		DELETE_DIRECTORY(state, directoryId) {
			const index = state.directory.findIndex(dir => dir.id === directoryId);
			state.directory.splice(index, 1);
		}
	},

	getters: {
		directoryList: (state) => (id) => {
			const directory = state.directory.find(dir => dir.id === id);
			return directory.children;
		}
	}

})