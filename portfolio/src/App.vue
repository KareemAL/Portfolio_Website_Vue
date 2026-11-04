<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { gsap } from 'gsap'

const router = useRouter()
const showStartup = ref(true)

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

const headerVisible = ref(true)
let lastScrollY = 0
const scrollThreshold = 10

const handleScroll = () => {
  const currentScrollY = window.scrollY
  const viewportHeight = window.innerHeight
  const scrollDelta = currentScrollY - lastScrollY

  // Header logic
  if (Math.abs(scrollDelta) > scrollThreshold) {
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      headerVisible.value = false
    } else {
      headerVisible.value = true
    }
  }

  // Snapping logic
  const sections = document.querySelectorAll<HTMLElement>('.snap-section')
  sections.forEach((section, index) => {
    const sectionTop = section.getBoundingClientRect().top
    if (Math.abs(sectionTop) < viewportHeight * 0.3) {
      if (scrollDelta > scrollThreshold && index < sections.length - 1) {
        sections[index + 1].scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (scrollDelta < -scrollThreshold && index > 0) {
        sections[index - 1].scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  })

  lastScrollY = currentScrollY
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)

  // Force dark theme on v-app background
  const appEl = document.querySelector('.v-application')
  if (appEl) {
    ;(appEl as HTMLElement).style.backgroundColor = '#222'
  }

  // Startup animation
  await nextTick()
  gsap.to('.starup_slideout', {
    y: -750,
    opacity: 0,
    duration: 2,
    ease: 'power2.inOut',
    onComplete: () => {
      showStartup.value = false
    },
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <v-app>
    <div v-if="showStartup" class="starup_slideout">
      <img src="@/assets/images/startup_slideout_2.png" alt="StartupSlideOut" class="startup_slideout_img">
    </div>

    <v-app-bar
      fixed
      color="#333"
      height="100"
      :style="{ transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform 0.3s ease', paddingLeft: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }"
    >
      <template v-slot:prepend>
        <v-btn icon @click="router.push('/')" class="profile-btn">
          <v-avatar size="60" class="profile-avatar">
            <v-img src="/homebutton_image2.jpg"></v-img>
          </v-avatar>
        </v-btn>
      </template>

      <v-toolbar-items class="hidden-sm-and-down ml-4">
        <template v-for="navLink in navLinks" :key="navLink.label">
          <v-btn
            variant="text"
            class="nav-link-btn"
            @click="navLink.children?.length ? null : router.push(navLink.path)"
          >
            {{ navLink.label }}
            <v-menu v-if="navLink.children?.length" open-on-hover activator="parent">
              <v-list bg-color="#333">
                <v-list-item
                  v-for="navChild in navLink.children"
                  :key="navChild.label"
                  @click="navChild.children?.length ? null : router.push(navChild.path)"
                  class="dropdown-item"
                >
                  <v-list-item-title>{{ navChild.label }}</v-list-item-title>
                  <v-menu
                    v-if="navChild.children?.length"
                    activator="parent"
                    open-on-hover
                    submenu
                  >
                    <v-list bg-color="#333">
                      <v-list-item
                        v-for="navGrandchild in navChild.children"
                        :key="navGrandchild.label"
                        @click="router.push(navGrandchild.path)"
                        class="dropdown-item"
                      >
                        <v-list-item-title>{{ navGrandchild.label }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>
        </template>
      </v-toolbar-items>

      <v-spacer class="hidden-md-and-up"></v-spacer>
      <v-app-bar-nav-icon class="hidden-md-and-up"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style>
.profile-btn {
  width: 60px !important;
  height: 60px !important;
}
.profile-avatar {
  border: 2px solid var(--primary-accent);
  transition: all 0.3s ease;
}
.profile-btn:hover .profile-avatar {
  border: 10px solid transparent;
  transform: scale(1.1);
}
.nav-link-btn {
  color: white !important;
  font-size: 18px !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  padding: 0 20px !important;
  height: 100% !important;
  transition: all 0.3s ease !important;
  border: 7px solid transparent !important;
}
.nav-link-btn:hover {
  color: var(--primary-accent) !important;
  border: 1px solid white !important;
  background-color: var(--bg-dark) !important;
}
.dropdown-item {
  color: white !important;
  transition: all 0.2s ease;
}
.dropdown-item:hover {
  background-color: var(--primary-accent) !important;
  color: #111 !important;
}

.starup_slideout {
  display: flex;
  position: fixed;
  height: auto;
  width: 100vw;
  z-index: 9999;
  //background-image: linear-gradient(to bottom, rgba(128, 128, 128, 1), rgba(128, 128, 128, 0));
  background-image: linear-gradient(to bottom, rgba(34, 34, 34, 1), rgba(34, 34, 34, 0));
}
.startup_slideout_img {
  opacity: 1;
  width: 100%;
}
@media screen and (max-width: 768px) {
  .starup_slideout {
    height: 30vh;
    transform: translateY(30%);
  }
}
</style>
