import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './plugins/vuex';
import router from './plugins/router';
import Directory from './utility/directory';

Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  router,

  created() {
    /** initialize the root directory */
    const root = new Directory("root");
    this.$store.commit('ADD_DIRECTORY', root);
  },

  render: h => h(App)
}).$mount('#app')
