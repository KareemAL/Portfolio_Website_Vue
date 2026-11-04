<script setup lang="ts">
import HeroCarousel from '@/components/HeroCarousel.vue'
import HeroSeparator from '@/components/HeroSeparator.vue'
import AnimatedSection from '@/components/AnimatedSection.vue'
import MainFooter from '@/components/MainFooter.vue'
</script>

<template>
  <main>
    <HeroCarousel />
    
    <HeroSeparator />

    <AnimatedSection>
      <h2>About Me</h2>
      <img src="@/assets/images/hero_carousel/carousel1.png" alt="About Photo" class="section-img">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae. </p>
      <br>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae. </p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae. </p>
    </AnimatedSection>

    <AnimatedSection>
      <h2>Skills</h2>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae. </p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae. </p>
      <br>
      <img src="@/assets/images/hero_carousel/carousel1.png" alt="Skills Photo" class="section-img">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae. </p>
    </AnimatedSection>

    <MainFooter />
  </main>
</template>

<style scoped>
.section-img {
  border-radius: 20px;
  border: 1px solid var(--primary-accent);
  padding: 1px;
  max-width: 80%;
  height: auto;
  margin: 20px 0;
}
</style>
