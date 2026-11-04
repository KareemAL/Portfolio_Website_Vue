<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { navLinks, type NavLink } from './navigation'

const router = useRouter()
const showStartup = ref(true)
const drawer = ref(false)

const navigateAndClose = (path: string) => {
  router.push(path)
  drawer.value = false
}

const getGroupedChildren = (children?: NavLink[]) => {
  if (!children) return {}
  const groups: Record<string, NavLink[]> = {}
  children.forEach((child) => {
    const col = child.column || 'General'
    if (!groups[col]) groups[col] = []
    groups[col].push(child)
  })
  return groups
}

const hasColumns = (link: NavLink) => {
  return link.children?.some((child) => child.column)
}

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

      <v-toolbar-items class="hidden-sm-and-down align-center" style="margin-left: 0;">
        <template v-for="navLink in navLinks" :key="navLink.label">
          <v-btn
            variant="text"
            class="nav-link-btn"
            @click="router.push(navLink.path)"
          >
            {{ navLink.label }}
            <v-menu v-if="navLink.children?.length" open-on-hover activator="parent">
              <v-list bg-color="#333">
                <v-list-item
                  v-for="navChild in navLink.children"
                  :key="navChild.label"
                  @click.stop="router.push(navChild.path)"
                  class="dropdown-item"
                >
                  <v-list-item-title>{{ navChild.label }}</v-list-item-title>
                  <v-menu
                    v-if="navChild.children?.length"
                    activator="parent"
                    open-on-hover
                    submenu
                  >
                    <div v-if="hasColumns(navChild)" class="columnar-menu">
                      <div v-for="(group, colName) in getGroupedChildren(navChild.children)" :key="colName" class="dropdown-column">
                        <div class="column-header">{{ colName }}</div>
                        <v-list bg-color="transparent" class="pa-0">
                          <v-list-item
                            v-for="item in group"
                            :key="item.label"
                            @click.stop="router.push(item.path)"
                            class="dropdown-item"
                          >
                            <v-list-item-title>{{ item.label }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </div>
                    </div>
                    <v-list v-else bg-color="#333">
                      <v-list-item
                        v-for="navGrandchild in navChild.children"
                        :key="navGrandchild.label"
                        @click.stop="router.push(navGrandchild.path)"
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

      <v-spacer></v-spacer>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      location="right"
      temporary
      color="#333"
      theme="dark"
      width="300"
    >
      <v-list bg-color="#333">
        <template v-for="link in navLinks" :key="link.label">
          <v-list-group v-if="link.children?.length" :value="link.label">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" class="drawer-item">
                <v-list-item-title @click.stop="navigateAndClose(link.path)">
                  {{ link.label }}
                </v-list-item-title>
              </v-list-item>
            </template>

            <template v-for="child in link.children" :key="child.label">
              <v-list-group v-if="child.children?.length" :value="child.label">
                <template v-slot:activator="{ props }">
                  <v-list-item v-bind="props" class="drawer-item pl-6">
                    <v-list-item-title @click.stop="navigateAndClose(child.path)">
                      {{ child.label }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
                <v-list-item
                  v-for="grandchild in child.children"
                  :key="grandchild.label"
                  :title="grandchild.label"
                  @click="navigateAndClose(grandchild.path)"
                  class="drawer-item pl-10"
                ></v-list-item>
              </v-list-group>
              <v-list-item
                v-else
                :title="child.label"
                @click="navigateAndClose(child.path)"
                class="drawer-item pl-6"
              ></v-list-item>
            </template>
          </v-list-group>
          <v-list-item
            v-else
            :title="link.label"
            @click="navigateAndClose(link.path)"
            class="drawer-item"
          ></v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
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
  height: 60px !important;
  margin: 0 5px !important;
  transition: all 0.3s ease !important;
  border: 7px solid transparent !important;
  border-radius: 4px !important;
}
.nav-link-btn:hover {
  color: var(--primary-accent) !important;
  border: 1px solid white !important;
  background-color: var(--bg-dark) !important;
}
.nav-link-btn:hover :deep(.v-btn__content) {
  color: var(--primary-accent) !important;
}
.nav-link-btn:hover :deep(.v-btn__overlay),
.nav-link-btn:focus :deep(.v-btn__overlay),
.nav-link-btn:active :deep(.v-btn__overlay),
.nav-link-btn[class*="--active"] :deep(.v-btn__overlay) {
  opacity: 0 !important;
}
.dropdown-item {
  color: white !important;
  transition: all 0.2s ease;
  margin: 5px 0 !important;
}
.dropdown-item:hover {
  background-color: var(--primary-accent) !important;
  color: #111 !important;
  border-radius: 2px !important;
}
.dropdown-item:hover :deep(.v-list-item-title) {
  color: #111 !important;
}
.dropdown-item:hover :deep(.v-list-item__overlay),
.dropdown-item:focus :deep(.v-list-item__overlay),
.dropdown-item:active :deep(.v-list-item__overlay),
.dropdown-item[class*="--active"] :deep(.v-list-item__overlay) {
  opacity: 0 !important;
}
.drawer-item {
  color: white !important;
  transition: all 0.2s ease;
}
.drawer-item:hover {
  background-color: var(--primary-accent) !important;
  color: #111 !important;
  border-radius: 2px !important;
}
.drawer-item:hover :deep(.v-list-item-title) {
  color: #111 !important;
}
.drawer-item:hover :deep(.v-list-item__overlay),
.drawer-item:focus :deep(.v-list-item__overlay),
.drawer-item:active :deep(.v-list-item__overlay),
.drawer-item[class*="--active"] :deep(.v-list-item__overlay) {
  opacity: 0 !important;
}

/* Highlight expanded groups in the drawer */
:deep(.v-list-group--open) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
:deep(.v-list-group--open) > :deep(.v-list-group__items) {
  background-color: rgba(255, 255, 255, 0.02) !important;
}

.columnar-menu {
  display: flex;
  flex-direction: row;
  background-color: #333;
  padding: 10px 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.dropdown-column {
  min-width: 180px;
  padding: 0 15px;
  display: flex;
  flex-direction: column;
}
.dropdown-column:not(:last-child) {
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}
.column-header {
  color: var(--primary-accent);
  font-weight: bold;
  font-size: 13px;
  text-transform: uppercase;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(183, 135, 87, 0.3);
  letter-spacing: 1px;
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
