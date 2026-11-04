<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { navLinks, type NavLink } from '../navigation'
import AnimatedSection from '@/components/AnimatedSection.vue'
import MainFooter from '@/components/MainFooter.vue'

const route = useRoute()

const findLinkByPath = (links: NavLink[], path: string): NavLink | null => {
  for (const link of links) {
    // Exact match or match without trailing slash
    if (link.path === path || link.path === path.replace(/\/$/, '')) return link
    if (link.children) {
      const found = findLinkByPath(link.children, path)
      if (found) return found
    }
  }
  return null
}

const currentLink = computed(() => findLinkByPath(navLinks, route.path))

const pageTitle = computed(() => currentLink.value?.label || 'Projects')
const subItems = computed(() => currentLink.value?.children || [])
</script>

<template>
  <main>
    <AnimatedSection class="non-snap-section">
      <div class="container_centered py-10">
        <h1>{{ pageTitle }}</h1>
        <div v-if="subItems.length > 0" class="sub-items-container">
          <p class="mb-8">Select a category or project below to explore my work.</p>
          <div class="sub-items-grid">
            <div
              v-for="item in subItems"
              :key="item.path"
              class="sub-item-card"
              @click="$router.push(item.path)"
            >
              <h3>{{ item.label }}</h3>
              <span v-if="item.column" class="column-badge">{{ item.column }}</span>
            </div>
          </div>
        </div>
        <div v-else class="project-detail-placeholder">
          <p>This is the subpage for <strong>{{ pageTitle }}</strong>.</p>
          <p class="low_importance">Content for this specific project is currently being populated.</p>
        </div>
      </div>
    </AnimatedSection>
    <MainFooter />
  </main>
</template>

<style scoped>
.py-10 {
  padding-top: 40px;
  padding-bottom: 40px;
}
.mb-8 {
  margin-bottom: 30px;
}
.sub-items-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}
.sub-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}
.sub-item-card {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(183, 135, 87, 0.3);
  border-radius: 8px;
  padding: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
}
.sub-item-card:hover {
  background-color: rgba(183, 135, 87, 0.1);
  border-color: var(--primary-accent);
  transform: translateY(-5px);
}
.sub-item-card h3 {
  margin: 0;
  color: white;
  font-size: 1.5rem;
}
.column-badge {
  margin-top: 10px;
  background-color: var(--primary-accent);
  color: #111;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}
.project-detail-placeholder {
  margin-top: 40px;
}
</style>
