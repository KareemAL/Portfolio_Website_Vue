<script setup lang="ts">
import AnimatedSection from '@/components/AnimatedSection.vue'
import MainFooter from '@/components/MainFooter.vue'
import GameEmbed from '@/components/GameEmbed.vue'
</script>

<template>
  <main>
    <AnimatedSection class="non-snap-section">
      <div class="inkheist-container">
        <div class="inkheist-header">
          <h1>Ink Heist</h1>
          <div class="accent-line"></div>
        </div>
        
        <GameEmbed 
          src="https://itch.io/embed-upload/18269418?color=555555"
          title="Play Ink Heist"
          aspectRatio="1920 / 1100"
          itchUrl="https://kareemalkhalily.itch.io/inkheist"
        />

        <div class="inkheist-details">
          <div class="description">
            <p>This is a <strong>manually designed</strong> subpage. You can put whatever HTML/Vue components you want here.</p>
            <p>Unlike the dynamic pages, you have full control over the layout of this specific project.</p>
          </div>
          
          <div class="widget-container">
            <iframe
              title="Ink Heist on itch.io"
              src="https://itch.io/embed/4751019?dark=true"
              frameborder="0"
              height="167"
              width="552"
            >
              <a href="https://kareemalkhalily.itch.io/inkheist">Ink Heist by KareemAlKhalily</a>
            </iframe>
          </div>
        </div>
      </div>
    </AnimatedSection>
    <MainFooter />
  </main>
</template>

<style scoped>
.inkheist-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 20px;
  color: white;
}
.inkheist-header h1 {
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

.inkheist-details {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 40px;
  align-items: start;
}

.widget-container {
  display: flex;
  justify-content: center;
}

.widget-container iframe {
  max-width: 100%;
}

.description p {
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 20px;
  padding: 0;
}

@media (max-width: 992px) {
  .inkheist-details {
    grid-template-columns: 1fr;
  }
  
  .widget-container {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .inkheist-header h1 {
    font-size: 2.5rem;
  }
}
</style>
