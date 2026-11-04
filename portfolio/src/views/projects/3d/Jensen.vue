<script setup lang="ts">
import AnimatedSection from '@/components/AnimatedSection.vue'
import MainFooter from '@/components/MainFooter.vue'
</script>

<template>
  <main>
    <AnimatedSection class="non-snap-section">
      <div class="jensen-container">
        <div class="jensen-header">
          <h1>Jensen Interceptor: The Bloodharbor Ripper</h1>
          <div class="accent-line"></div>
        </div>
        
        <div class="jensen-content">
          <div class="image-placeholder">
             <!-- Here you would put your custom layout, images, etc. -->
             <p>Custom 3D Model Showcase for jensen</p>
          </div>
          <div class="description">
            <p>This is a <strong>manually designed</strong> subpage. You can put whatever HTML/Vue components you want here.</p>
            <p>Unlike the dynamic pages, you have full control over the layout of this specific project.</p>
          </div>
        </div>
      </div>
    </AnimatedSection>
    <MainFooter />
  </main>
</template>

<style scoped>
.jensen-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 20px;
  color: white;
}
.jensen-header h1 {
  font-size: 3rem;
  color: var(--primary-accent);
  margin-bottom: 10px;
}
.accent-line {
  width: 100px;
  height: 4px;
  background-color: var(--primary-accent);
  margin-bottom: 40px;
}
.jensen-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}
.image-placeholder {
  background-color: #333;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--primary-accent);
}
.description p {
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 20px;
  padding: 0;
}
@media (max-width: 768px) {
  .jensen-content {
    grid-template-columns: 1fr;
  }
}
</style>
