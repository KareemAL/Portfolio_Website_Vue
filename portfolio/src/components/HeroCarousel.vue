<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { gsap } from 'gsap'

const slides = [
  {
    id: 1,
    type: 'hero',
    image: '/src/assets/images/Kareem_Al-khalily_Protrait_2025.jpg',
    previewImage: '/src/assets/images/hero_carousel/carousel0.png',
  },
  { id: 2, type: 'image', image: '/src/assets/images/hero_carousel/carousel1.png' },
  { id: 3, type: 'image', image: '/src/assets/images/hero_carousel/carousel2.png' },
  { id: 4, type: 'image', image: '/src/assets/images/hero_carousel/carousel3.png' },
  { id: 5, type: 'image', image: '/src/assets/images/hero_carousel/carousel4.png' },
  { id: 6, type: 'image', image: '/src/assets/images/hero_carousel/carousel5.png' },
]

const currentIndex = ref(0)
const slideRefs = ref<HTMLElement[]>([])
const isAnimating = ref(false)

const leftImgRef = ref<HTMLElement | null>(null)
const rightImgRef = ref<HTMLElement | null>(null)
const leftOutlineRef = ref<HTMLElement | null>(null)
const rightOutlineRef = ref<HTMLElement | null>(null)
const leftArrowRef = ref<HTMLElement | null>(null)
const rightArrowRef = ref<HTMLElement | null>(null)

const prevIndex = computed(() => (currentIndex.value - 1 + slides.length) % slides.length)
const nextIndex = computed(() => (currentIndex.value + 1) % slides.length)

const prevImageUrl = computed(() => slides[prevIndex.value].previewImage || slides[prevIndex.value].image)
const nextImageUrl = computed(() => slides[nextIndex.value].previewImage || slides[nextIndex.value].image)

const goToSlide = (newIndex: number) => {
  if (isAnimating.value || newIndex === currentIndex.value) return
  isAnimating.value = true

  const currentSlide = slideRefs.value[currentIndex.value]
  const nextSlide = slideRefs.value[newIndex]
  let direction = newIndex > currentIndex.value ? 1 : -1

  // Wrapping logic
  if (currentIndex.value === slides.length - 1 && newIndex === 0) direction = 1
  else if (currentIndex.value === 0 && newIndex === slides.length - 1) direction = -1

  gsap.set(nextSlide, { x: direction * 100 + '%', opacity: 1 })
  
  gsap.to(currentSlide, {
    x: -direction * 100 + '%',
    opacity: 0,
    duration: 0.5,
  })

  gsap.to(nextSlide, {
    x: '0%',
    opacity: 1,
    duration: 0.5,
    onComplete: () => {
      currentIndex.value = newIndex
      isAnimating.value = false
    }
  })
}

const slideNext = () => {
  if (isAnimating.value) return
  const direction = 'right'
  clickAnimation(rightImgRef.value, leftImgRef.value, rightOutlineRef.value, direction)
  goToSlide(nextIndex.value)
}

const slidePrev = () => {
  if (isAnimating.value) return
  const direction = 'left'
  clickAnimation(leftImgRef.value, rightImgRef.value, leftOutlineRef.value, direction)
  goToSlide(prevIndex.value)
}

// Hover animations
const hoverAnimationIn = (element: HTMLElement | null, outline: HTMLElement | null, direction: 'left' | 'right') => {
  if (!element || !outline) return
  gsap.killTweensOf(element)
  gsap.to(element, {
    x: direction === "left" ? 50 : -50,
    duration: 0.3,
    ease: "power1.out",
    opacity: 1,
  })
  gsap.to(element, {
    css: {
      [direction === "left" ? "--previewMask_left_X" : "--previewMask_right_X"]: direction === "left" ? -300 : 300
    }
  })
  gsap.to(outline, {
    x: direction === "left" ? 252 : -248,
    duration: 0.3,
    ease: "power1.out",
    opacity: 1,
  })
}

const hoverAnimationOut = (element: HTMLElement | null, outline: HTMLElement | null, direction: 'left' | 'right') => {
  if (!element || !outline) return
  gsap.killTweensOf(element)
  gsap.to(element, {
    x: 0,
    opacity: 0,
    duration: 0.3,
    ease: "power1.out",
  })
  gsap.to(element, {
    css: {
      [direction === "left" ? "--previewMask_left_X" : "--previewMask_right_X"]: direction === "left" ? -500 : 500
    }
  }, '<')
  gsap.to(element, {
    opacity: 1,
    duration: 0.7,
    ease: "power1.inOut",
    delay: 0.7
  })
  gsap.to(outline, {
    x: 0,
    duration: 0.3,
    ease: "power1.out",
    opacity: 1,
  })
}

const clickAnimation = (element: HTMLElement | null, nonElement: HTMLElement | null, outline: HTMLElement | null, direction: 'left' | 'right') => {
  if (!element || !nonElement || !outline) return
  gsap.killTweensOf(element)

  gsap.to(element, {
    x: direction === "left" ? 800 : -800,
    opacity: 1,
    duration: 0.5,
    ease: "power1.out"
  })
  gsap.to(element, {
    css: {
      [direction === "left" ? "--previewMask_left_X" : "--previewMask_right_X"]: direction === "left" ? -1200 : 1200
    },
  }, '<')
  gsap.to(outline, {
    x: direction === "left" ? 100 : -100,
    duration: 0.3,
    ease: "power1.inOut",
    opacity: 0,
  }, '<')
  gsap.to(element, {
    opacity: 0,
    duration: 0.3,
    ease: "power1.out",
    delay: 0.3
  })
  gsap.to(element, {
    x: direction === "left" ? -400 : 400,
    opacity: 0,
    duration: 0,
    delay: 0.6
  })
  gsap.to(outline, {
    x: direction === "left" ? -400 : 400,
    opacity: 0,
    duration: 0,
    delay: 0.6
  }, '<')
  gsap.to(element, {
    x: 0,
    opacity: 0.3,
    duration: 1,
    ease: "power1.out",
    delay: 0.6
  })
  gsap.to(nonElement, {
    opacity: 0,
    duration: 0.6,
    ease: "power1.inOut"
  })
  gsap.to(nonElement, {
    opacity: 1,
    duration: 0.6,
    ease: "power1.inOut",
    delay: 0.6
  })
}

onMounted(() => {
  slideRefs.value.forEach((slide, i) => {
    if (i === 0) {
      gsap.set(slide, { x: '0%', opacity: 1 })
    } else {
      gsap.set(slide, { x: '100%', opacity: 0 })
    }
  })

  // Startup animations for carousel
  gsap.from(".hero", { opacity: 0, y: -120, duration: 2, ease: "power2.inOut", delay: 2 })
  gsap.from(".hero h1", { opacity: 0, y: -30, duration: 1, ease: "power2.inOut", delay: 3 })
  gsap.from(".hero p", { opacity: 0, y: 70, duration: 0.7, ease: "power1.out", delay: 3.2 })
  gsap.from(".hero_jobs .job", { opacity: 0, duration: 1, ease: "power1.inOut", delay: 3.2 })
  gsap.from(".hero_jobs .separator", { opacity: 0, duration: 1, ease: "power1.inOut", delay: 3.2 })
  gsap.from(".carousel-indicators", { opacity: 0, y: 70, duration: 1, ease: "power1.inOut", delay: 4.2 })
  
  gsap.fromTo(".carouselleft-arrow", { opacity: 0, x: -70 }, { opacity: 1, x: 0, duration: 1, ease: "power1.inOut", delay: 4 })
  gsap.fromTo(".carouselright-arrow", { opacity: 0, x: 70 }, { opacity: 1, x: 0, duration: 1, ease: "power1.inOut", delay: 4 })

  // Preview images startup
  const tl = gsap.timeline({ delay: 4.5 })
  tl.fromTo(leftImgRef.value, { x: -400, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power2.inOut" })
    .fromTo(rightImgRef.value, { x: 400, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power2.inOut" }, '<')
    .fromTo(leftOutlineRef.value, { x: -400, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power2.inOut" }, '<')
    .fromTo(rightOutlineRef.value, { x: 400, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power2.inOut" }, '<')
})
</script>

<template>
  <div class="carousel">
    <button
      ref="leftArrowRef"
      class="carouselarrow carouselleft-arrow"
      @click="slidePrev"
      @mouseenter="hoverAnimationIn(leftImgRef, leftOutlineRef, 'left')"
      @mouseleave="hoverAnimationOut(leftImgRef, leftOutlineRef, 'left')"
    >
      <img src="@/assets/images/carouselarrow_left.png" alt="Previous">
    </button>

    <!-- Preview Images -->
    <div ref="leftOutlineRef" id="carousel_previewOutline_left" class="carousel_previewoutline">
      <img src="@/assets/images/hero_carousel/carousel_prevoutline_left.png">
    </div>
    <div ref="leftImgRef" id="carousel_previewimg_left" class="carousel_previewimg">
      <img :src="prevImageUrl">
    </div>

    <div
      v-for="(slide, index) in slides"
      :key="slide.id"
      class="carouselcontent"
      :class="{ carouselactive: index === currentIndex, hero: slide.type === 'hero' }"
      :ref="(el) => { if (el) slideRefs[index] = el as HTMLElement }"
    >
      <template v-if="slide.type === 'hero'">
        <img :src="slide.image" alt="Profile" class="profile-pic">
        <div class="text">
          <h1>Kareem Al-Khalily</h1>
          <div class="hero_jobs">
            <span class="job">3D-Artist</span>
            <span class="separator ml-1 mr-1">|</span>
            <span class="job">Technical Artist</span>
            <span class="separator ml-1 mr-1">|</span>
            <span class="job">Developer</span>
          </div>
          <p>Welcome to my portfolio. I create art and renderings, develop in frontend webdev and make games</p>
        </div>
      </template>
      <template v-else>
        <img :src="slide.image" class="carousel_image">
      </template>
    </div>

    <div ref="rightOutlineRef" id="carousel_previewOutline_right" class="carousel_previewoutline">
      <img src="@/assets/images/hero_carousel/carousel_prevoutline_right.png">
    </div>
    <div ref="rightImgRef" id="carousel_previewimg_right" class="carousel_previewimg">
      <img :src="nextImageUrl">
    </div>

    <button
      ref="rightArrowRef"
      class="carouselarrow carouselright-arrow"
      @click="slideNext"
      @mouseenter="hoverAnimationIn(rightImgRef, rightOutlineRef, 'right')"
      @mouseleave="hoverAnimationOut(rightImgRef, rightOutlineRef, 'right')"
    >
      <img src="@/assets/images/carouselarrow_right.png" alt="Next">
    </button>

    <div class="dots-wrapper">
      <div class="carousel-indicators">
        <div
          v-for="(_, index) in slides"
          :key="index"
          class="dot"
          :class="{ active: index === currentIndex }"
          @click="goToSlide(index)"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carouselcontent {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transform: translateX(100%);
  text-align: center;
  color: white;
}

.carousel_image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-pic {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid white;
  z-index: 1;
}

.text {
  z-index: 1;
  margin-top: 20px;
}

.hero_jobs {
  font-weight: lighter;
  font-size: 35px;
  white-space: nowrap;
}

.separator {
  margin: 0 10px;
}

.carouselarrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(51, 51, 51, 0.9);
  border: none;
  cursor: pointer;
  width: 7vh;
  height: 7vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 40%;
  transition: background-color 0.3s ease, transform 0.3s ease, border 0.1s ease;
}

.carouselarrow:hover {
  background-color: rgba(1, 1, 1, 0.3);
  border: 2px solid var(--primary-accent);
}

.carouselleft-arrow { left: 20px; }
.carouselright-arrow { right: 20px; }

.carouselarrow img {
  width: 100%;
  height: auto;
  pointer-events: none;
}

/* Preview images */
.carousel_previewimg {
  display: flex;
  position: absolute;
  z-index: 1;
  transform: scale(1);
}

.carousel_previewoutline {
  display: flex;
  position: absolute;
  z-index: 2;
  transform: scale(1);
}

#carousel_previewOutline_left {
  transform-origin: center right;
  left: -1295px;
}
#carousel_previewOutline_right {
  transform-origin: center right;
  right: -1300px;
}

#carousel_previewimg_left {
  --previewMask_left_X: -500px;
  --previewMask_left_Y: 0%;
  transform-origin: center right;
  left: -1250px;
  mask-image: url("@/assets/images/hero_carousel/carousel_prevmask_left.png");
  mask-size: cover;
  mask-repeat: no-repeat;
  mask-position: var(--previewMask_left_X) var(--previewMask_left_Y);
  -webkit-mask-image: url("@/assets/images/hero_carousel/carousel_prevmask_left.png");
  -webkit-mask-size: cover;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: var(--previewMask_left_X) var(--previewMask_left_Y);
}

#carousel_previewimg_right {
  --previewMask_right_X: 500px;
  --previewMask_right_Y: 0%;
  transform-origin: center left;
  right: -1250px;
  mask-image: url("@/assets/images/hero_carousel/carousel_prevmask_right.png");
  mask-size: cover;
  mask-repeat: no-repeat;
  mask-position: var(--previewMask_right_X) var(--previewMask_right_Y);
  -webkit-mask-image: url("@/assets/images/hero_carousel/carousel_prevmask_right.png");
  -webkit-mask-size: cover;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: var(--previewMask_right_X) var(--previewMask_right_Y);
}

#carousel_previewimg_left img, #carousel_previewimg_right img {
  max-width: none;
}

.dots-wrapper {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 10px 20px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.carousel-indicators {
  display: flex;
  gap: 10px;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: grey;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  width: 14px;
  height: 14px;
  background-color: white;
}

@media screen and (max-width: 768px) {
  .carouselarrow, .carousel_previewimg, .carousel_previewoutline { display: none; }
  .hero_jobs { font-size: 24px; }
  .hero_jobs span.separator { display: none; }
  .hero_jobs span { display: block; }
}
</style>
