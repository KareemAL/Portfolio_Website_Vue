<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          if (sectionRef.value) {
            observer?.unobserve(sectionRef.value)
          }
        }
      })
    },
    { threshold: 0.1 }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <section
    ref="sectionRef"
    class="lower_item_section non-snap-section"
    :class="{ show: isVisible }"
  >
    <div class="container_centered">
      <slot></slot>
    </div>
  </section>
</template>

<style scoped>
.lower_item_section {
  display: flex;
  align-content: center;
  justify-content: center;
  padding: 30px;
  width: 100%;
}
</style>
