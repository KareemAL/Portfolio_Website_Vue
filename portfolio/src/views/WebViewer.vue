<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import MainFooter from '@/components/MainFooter.vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const currentMesh = ref<string>('Unknown')
const introClicked = ref<number>(0)
const displayisMobile = ref<number>(0)
const isHovered = ref(false)
const isFocused = ref(false)
let patch: any = null

const meshDescriptions: Record<string, { title: string, shortDescription: string, longDescription: string }> = {
  '0': {
    title: 'Pyke',
    shortDescription: 'Pyke from League of Legends as a 3D printable',
    longDescription: 'A Project, originally conceived as a present for a friend, that has yielded a fully printable 3D minifigure. It depicts the Character "Pyke" from the video game "League of Legends". The Characters design is not my property or work, i have used this design non-commercially.'
  },
  '1': {
    title: 'Futuristic Building',
    shortDescription: 'A detailed 3D model of a futuristic architectural structure.',
    longDescription: 'This model explores complex geometries and procedural materials, showcasing a vision of future urban design. The intricate details are rendered in real-time using advanced PBR shaders.'
  },
  '2': {
    title: 'Abstract Sculpture',
    shortDescription: 'An organic, flowing form created through mathematical functions.',
    longDescription: 'This piece demonstrates the power of real-time vertex manipulation. By using sine waves and noise functions, the sculpture constantly evolves, creating a hypnotic and ever-changing visual experience.'
  },
  '3': {
    title: 'Mechanical Part',
    shortDescription: 'A precision-engineered industrial component.',
    longDescription: 'Highlighting clean topology and metallic PBR shader effects, this part represents high-end manufacturing. It shows off reflections and micro-surface details that bring the cold steel to life.'
  },
  'Default': {
    title: 'Empty',
    shortDescription: 'Empty Mesh Carousel Slot',
    longDescription: 'If you are seeing this, something went wrong, or js was not able to fetch the mesh info.'
  },
  'Intro': {
    title: 'Mesh Carousel',
    shortDescription: '⮜ Click anywhere on the box left, to view the 3D Web viewer',
    longDescription: 'The Cables.gl 3D patch demonstrates a "Mesh Carousel" where different 3D models can be showcased in a real-time WebGL environment. Explore the synergy between creative coding and 3D art.'
  }
}

const handleWheel = (event: WheelEvent) => {
  if (isHovered.value && isFocused.value) {
    event.preventDefault()
  }
}

const currentInfo = computed(() => {
  if (introClicked.value === 0) {
    return meshDescriptions['Intro']
  }
  return meshDescriptions[currentMesh.value] || meshDescriptions['Default']
})

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
}

const initCables = () => {
  // @ts-ignore
  if (typeof CABLES === 'undefined' || !CABLES.Patch) {
    return
  }

  // @ts-ignore
  patch = new CABLES.Patch({
    // @ts-ignore
    patch: CABLES.exportedPatch,
    prefixAssetPath: '/cables/',
    assetPath: 'assets/',
    jsPath: 'js/',
    glCanvasId: 'glcanvas',
    glCanvasResizeToParent: true,
    onError: (initiator: any, ...args: any[]) => {
      // Errors should still be logged for debugging if something goes wrong in the patch
      // @ts-ignore
      console.error("[" + initiator + "]", ...args);
    },
    onPatchLoaded: (p: any) => {
      // Register variable watcher for "CurrentMesh"
      const meshVar = p.getVar('CurrentMesh')
      if (meshVar) {
        currentMesh.value = String(meshVar.getValue())
        meshVar.addListener((val: any) => {
          currentMesh.value = String(val)
        })
      }
      const introVar = p.getVar('IntroClicked?')
      if (introVar) {
        introClicked.value = Number(introVar.getValue())
        introVar.addListener((val: any) => {
          introClicked.value = Number(val)
        })
      }

      const updateMobileState = (p: any) => {
        // Set IsMobile variable in patch
        const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        
        // Try setting variable directly first, then emit event
        p.setVariable('IsMobile', isMobile ? 1 : 0)
        
        // Delay events slightly to ensure patch is fully initialized
        setTimeout(() => {
          if (isMobile) {
            p.emitEvent('SetIsMobileTrue')
          } else {
            p.emitEvent('SetIsMobileFalse')
          }
        }, 100)
      }

      updateMobileState(p)
      
      // Add resize listener to update mobile state dynamically
      window.addEventListener('resize', handleResize)

      const displayIsMobileVar = p.getVar('IsMobile')
      if (displayIsMobileVar) {
        displayisMobile.value = Number(displayIsMobileVar.getValue())
        displayIsMobileVar.addListener((val: any) => {
          displayisMobile.value = Number(val)
        })
      }
    },
    canvas: { alpha: true, premultipliedAlpha: true }
  })
}

onMounted(async () => {
  window.addEventListener('wheel', handleWheel, { passive: false })
  try {
    await loadScript('/cables/js/patch.js')
    
    // Cables patch.js might not trigger CABLES.jsLoaded if it's already loaded or loaded this way
    // We check if CABLES is available
    // @ts-ignore
    if (typeof CABLES !== 'undefined' && CABLES.exportedPatch) {
      initCables()
    } else {
      document.addEventListener('CABLES.jsLoaded', () => {
        initCables()
      })
    }
  } catch (error) {
    // Keep this error log as it's critical for failure detection
    console.error('WebViewer: Error loading Cables patch:', error)
  }
})

const handleResize = () => {
  if (patch) {
    // We define this in onPatchLoaded now, but we need a way to call it or just keep the logic consistent
    // Let's actually store the update function or just duplicate the simple logic if patch is available
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    patch.setVariable('IsMobile', isMobile ? 1 : 0)
    if (isMobile) patch.emitEvent('SetIsMobileTrue')
    else patch.emitEvent('SetIsMobileFalse')
  }
}

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('resize', handleResize)
  if (patch) {
    patch.pause()
    // If cables provides a destroy method, call it here
    // patch.destroy() 
  }
  document.removeEventListener('CABLES.jsLoaded', initCables)
})
</script>

<template>
  <main>
    <div class="webviewer-page">
      <div class="webviewer-layout">
        <div class="canvas-column">
          <div class="canvas-wrapper">
            <canvas
              id="glcanvas"
              ref="canvasRef"
              tabindex="1"
              @mouseenter="isHovered = true"
              @mouseleave="isHovered = false"
              @focus="isFocused = true"
              @blur="isFocused = false"
            ></canvas>
          </div>
        </div>
        <div class="text-column">
          <div class="text-content">
            <h1>3D Webviewer</h1>
            <Transition name="fade" mode="out-in">
              <div :key="introClicked === 0 ? 'Intro' : currentMesh">
                <h2>{{ currentInfo.title }}</h2>
                <p>
                  {{ currentInfo.shortDescription }}
                </p>
                <p>
                  {{ currentInfo.longDescription }}
                </p>
              </div>
            </Transition>
            <p>
              Feel free to interact with the viewer. You can rotate, zoom, and explore the models as they transition through the carousel.
            </p>
            <div v-if="currentMesh !== 'Unknown'" class="mesh-indicator">
              Currently viewing: <span>{{ currentMesh }}</span>
            </div>
            <div class="mesh-indicator">
              Is Mobile: <span>{{ displayisMobile }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <MainFooter />
  </main>
</template>

<style scoped>
.webviewer-page {
  width: 100%;
  min-height: calc(100vh - 100px);
  background-color: var(--bg-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.webviewer-layout {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1400px;
  height: 600px; /* Fixed height for the block */
  gap: 40px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid var(--primary-accent);
  overflow: hidden;
}

.canvas-column {
  flex: 2; /* Occupies 2/3 of the space */
  height: 100%;
  position: relative;
  background-color: #000;
}

.text-column {
  flex: 1; /* Occupies 1/3 of the space */
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  color: white;
}

.text-content h1 {
  margin: 0;
  font-size: 2.5rem;
  color: var(--primary-accent);
  text-align: left;
}

.text-content h2 {
  margin: 10px 0 20px 0;
  font-size: 1.5rem;
  color: white;
  text-align: left;
}

.text-content p {
  margin-top: 15px;
  padding: 0;
  font-size: 1rem;
  line-height: 1.6;
}

.mesh-indicator {
  margin-top: 30px;
  padding: 10px 15px;
  background-color: rgba(var(--primary-accent-rgb, 183, 135, 87), 0.1);
  border-left: 4px solid var(--primary-accent);
  font-size: 0.9rem;
  color: #ccc;
}

.mesh-indicator span {
  color: var(--primary-accent);
  font-weight: bold;
}

.canvas-wrapper {
  width: 100%;
  height: 100%;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#glcanvas {
  width: 100%;
  height: 100%;
  display: block;
  outline: 0;
}

@media screen and (max-width: 1024px) {
  .webviewer-layout {
    flex-direction: column;
    height: auto;
  }
  
  .canvas-column {
    height: 400px;
    width: 100%;
  }
  
  .text-column {
    padding: 30px;
  }
}
</style>
