import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ResumeView from '../views/ResumeView.vue'
import ContactView from '../views/ContactView.vue'
import WebViewer from '../views/WebViewer.vue'
import Jensen from '../views/projects/3d/Jensen.vue'
import InkHeist from '../views/projects/games/InkHeist.vue'
import MatBallsView from '../views/projects/techart/MatBallsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView,
    },
    {
      path: '/projects/3d/jensen',
      name: 'jensen',
      component: Jensen,
    },
    {
      path: '/projects/techart/matballs',
      name: 'matballs',
      component: MatBallsView,
    },
    {
      path: '/projects/games/inkheist',
      name: 'inkheist',
      component: InkHeist,
    },
    {
      path: '/projects/:category',
      component: ProjectsView,
    },
    {
      path: '/projects/:category/:id',
      component: ProjectsView,
    },
    {
      path: '/projects/3d_webviewer',
      name: 'webviewer',
      component: WebViewer,
    },
    {
      path: '/resume',
      name: 'resume',
      component: ResumeView,
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
    },
  ],
})

export default router
