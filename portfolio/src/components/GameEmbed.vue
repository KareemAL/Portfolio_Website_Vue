<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  src: string
  title?: string
  aspectRatio?: string
  itchUrl?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Game',
  aspectRatio: '1920 / 1100',
  itchUrl: ''
})

const isGameClosed = ref(false)
const iframeKey = ref(0)

const restartGame = () => {
  iframeKey.value++
  isGameClosed.value = false
}

const handleMessage = (event: MessageEvent) => {
  // We check for a specific message from the Unity game
  // To trigger this, the Unity game should call: 
  // window.parent.postMessage('unity-quit', '*')
  if (event.data === 'unity-quit') {
    isGameClosed.value = true
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="game-wrapper">
    <div class="game-container" :style="{ aspectRatio: aspectRatio }">
      <iframe
        :key="iframeKey"
        :title="title"
        :src="src"
        frameborder="0"
        allowfullscreen
      >
        <a v-if="itchUrl" :href="itchUrl">Play {{ title }} on itch.io</a>
      </iframe>

      <!-- Restart Overlay -->
      <Transition name="fade">
        <div v-if="isGameClosed" class="game-overlay">
          <div class="overlay-content">
            <h2>Game Session Ended</h2>
            <p>Would you like to play again?</p>
            <button @click="restartGame" class="restart-btn">Restart Game</button>
          </div>
        </div>
      </Transition>
    </div>

    <div class="game-actions">
      <button @click="restartGame" class="reload-btn" :title="'Reload ' + title + ' if it freezes'">
        <span class="icon">↻</span> Reload Game
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-wrapper {
  width: 100%;
}

.game-container {
  width: 100%;
  margin-bottom: 20px;
  border: 2px solid var(--primary-accent);
  background-color: #000;
  position: relative;
  overflow: hidden;
}

.game-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(4px);
}

.overlay-content {
  text-align: center;
  padding: 20px;
}

.overlay-content h2 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: var(--primary-accent);
}

.overlay-content p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.restart-btn {
  padding: 15px 40px;
  font-size: 1.2rem;
  background-color: var(--primary-accent);
  color: #222;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s, background-color 0.2s;
}

.restart-btn:hover {
  transform: scale(1.05);
  background-color: white;
}

.game-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 60px;
}

.reload-btn {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  padding: 5px 10px;
  border-radius: 4px;
}

.reload-btn:hover {
  color: var(--primary-accent);
  background-color: rgba(255, 255, 255, 0.05);
}

.reload-btn .icon {
  font-size: 1.2rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .overlay-content h2 {
    font-size: 1.5rem;
  }
  
  .game-container {
    margin-bottom: 40px;
  }
}
</style>
