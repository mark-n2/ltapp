import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Recording from './views/Recording.vue'
import About from './views/About.vue'
import DataViewer from './views/DataViewer.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/recording',
      name: 'recording',
      component: Recording
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/viewer',
      name: 'viewer',
      component: DataViewer
    }
  ]
})
