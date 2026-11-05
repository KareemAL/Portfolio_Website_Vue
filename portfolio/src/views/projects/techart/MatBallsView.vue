<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import AnimatedSection from '@/components/AnimatedSection.vue'
import MainFooter from '@/components/MainFooter.vue'

// Parameters: 3 sliders, each with 10 steps (0 to 9)
const param1 = ref(0)
const param2 = ref(0)
const param3 = ref(0)

const isLoading = ref(false)
const loadedImages = ref(new Set<number>())

// Path to images: e.g. /images/matballs/0001.jpg to 1000.jpg
const getImagePath = (frame: number) => {
  // User files start at 0001.jpg for frame 0
  const paddedFrame = String(frame + 1).padStart(4, '0')
  return `/images/matballs/${paddedFrame}.jpg`
}

const currentFrame = computed(() => {
  return (param3.value * 100) + (param2.value * 10) + param1.value
})

const totalFrames = 1000

// Preload adjacent frames for smoother scrubbing
const preloadFrames = (centerFrame: number) => {
  const range = 5 // Preload 5 frames ahead and behind
  for (let i = -range; i <= range; i++) {
    const f = centerFrame + i
    if (f >= 0 && f < totalFrames && !loadedImages.value.has(f)) {
      const img = new Image()
      img.src = getImagePath(f)
      img.onload = () => loadedImages.value.add(f)
    }
  }
}

watch(currentFrame, (newFrame) => {
  preloadFrames(newFrame)
})

onMounted(() => {
  preloadFrames(currentFrame.value)
})

</script>

<template>
  <main>
    <AnimatedSection class="non-snap-section">
      <div class="matballs-container">
        <div class="content-layout">
          <div class="controls-box">
            <div class="header-text">
              <h1>MatBalls</h1>
              <p>Adjust the parameters below to see how the .sbsar material changes in real-time.</p>
            </div>
            
            <div class="display-box">
              <div v-if="isLoading" class="loader">Loading Material...</div>
              
              <img 
                :src="getImagePath(currentFrame)"
                class="matball-display"
                alt="Matball Frame"
              />
              
              <div class="frame-info">Frame: {{ currentFrame }}</div>
            </div>

            <div class="sliders-container">
              <div class="slider-group">
                <div class="slider-header">
                  <span>Parameter 1</span>
                  <span class="value-display">{{ param1 }}</span>
                </div>
                <v-slider
                  v-model="param1"
                  :min="0"
                  :max="9"
                  :step="1"
                  hide-details
                  color="var(--primary-accent)"
                ></v-slider>
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Parameter 2</span>
                  <span class="value-display">{{ param2 }}</span>
                </div>
                <v-slider
                  v-model="param2"
                  :min="0"
                  :max="9"
                  :step="1"
                  hide-details
                  color="var(--primary-accent)"
                ></v-slider>
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span>Parameter 3</span>
                  <span class="value-display">{{ param3 }}</span>
                </div>
                <v-slider
                  v-model="param3"
                  :min="0"
                  :max="9"
                  :step="1"
                  hide-details
                  color="var(--primary-accent)"
                ></v-slider>
              </div>
            </div>

            <div class="info-note">
              <p class="low_importance">
                This demonstration uses a pre-rendered 1000-frame sequence where each frame represents a specific combination of three material parameters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
    <MainFooter />
  </main>
</template>

<style scoped>
.matballs-container {
  width: 100%;
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: var(--bg-dark);
}

.content-layout {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1200px;
  gap: 40px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 40px;
  border-radius: 12px;
  border: 1px solid rgba(183, 135, 87, 0.3);
}

.display-box {
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #444;
  margin-bottom: 20px;
}

.matball-display {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.controls-box {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header-text {
  margin-bottom: 20px;
}

.header-text h1 {
  color: var(--primary-accent);
  margin-bottom: 10px;
}

.sliders-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

/* Desktop layout adjustment: put display box and sliders side-by-side */
@media (min-width: 961px) {
  .controls-box {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    grid-template-areas: 
      "header header"
      "display sliders"
      "note note";
    gap: 0 40px;
  }
  .header-text { grid-area: header; }
  .display-box { grid-area: display; margin-bottom: 0; }
  .sliders-container { grid-area: sliders; align-self: center; }
  .info-note { grid-area: note; }
}

.slider-group {
  margin: 0;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 500;
}

.value-display {
  color: var(--primary-accent);
  font-family: monospace;
  font-size: 1.2rem;
}

.frame-info {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0,0,0,0.6);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #aaa;
}

.loader {
  color: var(--primary-accent);
}

.info-note {
  margin-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 20px;
}

@media (max-width: 960px) {
  .matballs-container {
    padding: 10px;
    align-items: flex-start;
  }
  .content-layout {
    flex-direction: column;
    padding: 15px;
    gap: 20px;
  }
  .display-box {
    width: 100%;
    max-width: none;
    margin: 0;
  }
  .header-text h1 {
    font-size: 1.8rem;
  }
}
</style>
