import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import Dexie from 'dexie'

Vue.config.productionTip = false

Vue.use(Vuetify)

// Define DB
const mixIn = {
  created () {
    this.db = new Dexie('LtAppDb')
    this.db.version(1).stores({
      notes: "++id, title, subtitle",
      data: "++id, no, date, accX, accY, accZ, gyroX, gyroY, gyroZ"
    })
  }
}
Vue.mixin(mixIn)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
