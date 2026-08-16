<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '@/stores/characterStore'
import { getImagePathForRank, getRankTitleForRank } from '@/assets/Vagabond/vagabondDatas'

const characterStore = useCharacterStore()
const { characterStats } = storeToRefs(characterStore)

const displayedXp = ref(0)
const showLevelUp = ref(false)
const showLevelDown = ref(false)
const previousLevel = ref<number | null>(null)

const xpPercent = computed(() => {
  if (!characterStats.value) return 0
  return Math.min(100, (displayedXp.value / characterStats.value.xp_needed) * 100)
})

const rankTitle = computed(() => {
  if (!characterStats.value) return null
  return getRankTitleForRank(characterStats.value.actual_rank)
})

const characterImage = computed(() => {
  if (!characterStats.value) return undefined
  return getImagePathForRank(characterStats.value.actual_rank)
})

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function animateXpBarTo(targetValue: number, duration = 800) {
  return new Promise<void>((resolve) => {
    const start = displayedXp.value
    const startTime = performance.now()

    function step(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      displayedXp.value = start + (targetValue - start) * eased

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        resolve()
      }
    }
    requestAnimationFrame(step)
  })
}

async function playStatsAnimation(stats: NonNullable<typeof characterStats.value>) {
  const hasLeveledUp = previousLevel.value !== null && stats.actual_level > previousLevel.value
  const hasLeveledDown = previousLevel.value !== null && stats.actual_level < previousLevel.value

  if (hasLeveledUp) {
    await animateXpBarTo(stats.xp_needed, 500)
    await wait(200)
    displayedXp.value = 0
    triggerLevelUp()
    await wait(400)
    await animateXpBarTo(stats.actual_xp, 900)
  } else if (hasLeveledDown) {
    await animateXpBarTo(0, 500)
    await wait(200)
    displayedXp.value = stats.xp_needed
    triggerLevelDown()
    await wait(400)
    await animateXpBarTo(stats.actual_xp, 900)
  } else {
    await animateXpBarTo(stats.actual_xp)
  }

  previousLevel.value = stats.actual_level
}

function triggerLevelUp() {
  showLevelUp.value = true
  setTimeout(() => {
    showLevelUp.value = false
  }, 2000)
}

function triggerLevelDown() {
  showLevelDown.value = true
  setTimeout(() => {
    showLevelDown.value = false
  }, 2000)
}

watch(characterStats, (newStats) => {
  if (newStats) playStatsAnimation(newStats)
})

onMounted(() => {
  characterStore.fetchCharacterStats()
})
</script>

<template>
  <div class="character-card" v-if="characterStats">
    <h2>Personnage</h2>

    <div class="character-visual">
      <Transition name="rank-fade" mode="out-in">
        <img
          :key="characterStats.actual_rank"
          :src="characterImage"
          :alt="String(characterStats.actual_rank)"
          class="character-img"
        />
      </Transition>

      <Transition name="levelup-pop">
        <div v-if="showLevelUp" class="level-up-badge">
          🎉 Niveau {{ characterStats.actual_level }} !
        </div>
      </Transition>

      <Transition name="levelup-pop">
        <div v-if="showLevelDown" class="level-down-badge">
          📉 Niveau {{ characterStats.actual_level }}
        </div>
      </Transition>
    </div>

    <p class="level-label">
      Niveau actuel : <strong>{{ characterStats.actual_level }}</strong>
    </p>
    <p class="rank-title">
      <strong>{{ rankTitle?.title }}</strong> - {{ rankTitle?.description }}
    </p>

    <div class="xp-bar-container">
      <div class="xp-bar-fill" :style="{ width: xpPercent + '%' }"></div>
      <span class="xp-bar-text">
        {{ Math.round(displayedXp) }} / {{ characterStats.xp_needed }} XP
      </span>
    </div>

    <p class="total-xp">XP total cumulé : {{ characterStats.total_xp_cumulated }}</p>
  </div>
</template>

<style scoped>
.character-card {
  max-width: 320px;
  margin: 1rem auto;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  position: relative;
}

.character-visual {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.character-img {
  width: 200px;
  border-radius: 8px;
}

.level-label {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.xp-bar-container {
  position: relative;
  width: 100%;
  height: 24px;
  background: #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.xp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transition: width 0.1s linear;
  border-radius: 12px;
}

.xp-bar-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
  text-shadow: 0 0 3px white;
}

.total-xp {
  font-size: 0.85rem;
  color: #666;
}

.rank-fade-enter-active,
.rank-fade-leave-active {
  transition: opacity 0.4s ease;
}
.rank-fade-enter-from,
.rank-fade-leave-to {
  opacity: 0;
}

.level-up-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #facc15;
  color: #78350f;
  font-weight: bold;
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

.levelup-pop-enter-active {
  animation: pop-bounce 0.5s ease;
}
.levelup-pop-leave-active {
  transition: opacity 0.4s ease;
}
.levelup-pop-leave-to {
  opacity: 0;
}

@keyframes pop-bounce {
  0% {
    transform: translateX(-50%) scale(0);
    opacity: 0;
  }
  60% {
    transform: translateX(-50%) scale(1.15);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) scale(1);
  }
}

.level-down-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #94a3b8;
  color: #1e293b;
  font-weight: bold;
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}
</style>
