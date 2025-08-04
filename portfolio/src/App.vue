<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

export type NavLink = {
  label: string
  path: string
  children?: NavLink[]
}

const navLinks: NavLink[] = [
  {
    label: 'Projects',
    path: '/projects',
    children: [
      {
        label: '3D Projects',
        path: '/projects/3d',
        children: [
          {
            label: 'Project 1',
            path: '/projects/3d/1',
          },
        ],
      },
      {
        label: '3D Webwiever',
        path: '/projects/3d_webviewer',
      },
    ],
  },
  {
    label: 'Résumé',
    path: '/resume',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
]
</script>

<template>
  <v-layout>
    <v-app-bar>
      <template v-slot:prepend>
        <v-btn icon @click="$router.push('/')">
          <v-avatar size="50">
            <v-img src="/homebutton_image2.jpg"></v-img>
          </v-avatar>
        </v-btn>
      </template>
      <v-btn v-for="navLink in navLinks" @click="$router.push(navLink.path)">
        {{ navLink.label }}
        <v-menu v-if="navLink.children && navLink.children.length" open-on-hover activator="parent">
          <v-list>
            <v-list-item v-for="navChild in navLink.children" @click="$router.push(navChild.path)">
              <v-list-item-title>{{ navChild.label }}</v-list-item-title>
              <v-menu
                :open-on-focus="false"
                activator="parent"
                open-on-hover
                submenu
                v-if="navChild.children && navChild.children.length"
              >
                <v-list>
                  <v-list-item
                    v-for="navGrandchild in navChild.children"
                    @click="$router.push(navGrandchild.path)"
                  >
                    <v-list-item-title>{{ navGrandchild.label }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </v-app-bar>
    <v-main><RouterView /></v-main>
  </v-layout>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
