<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCharacterStats } from '@/services/statsService'
import { DICT_PATH_VAGABOND_IMG } from '@/config'

const stats = ref(null)
const displayedXp = ref(0)
const showLevelUp = ref(false)
const showLevelDown = ref(false)
const previousLevel = ref(null)

const xpPercent = computed(() => {
  if (!stats.value) return 0
  return Math.min(100, (displayedXp.value / stats.value.xp_needed_this_level) * 100)
})

const characterImage = computed(() => {
  if (!stats.value) return null
  return DICT_PATH_VAGABOND_IMG[stats.value.rank] || DICT_PATH_VAGABOND_IMG.vagabond
})

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function animateXpBarTo(targetValue, duration = 800) {
  return new Promise((resolve) => {
    const start = displayedXp.value
    const startTime = performance.now()

    function step(currentTime) {
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

async function loadStats() {
  const newStats = await getCharacterStats()
  const hasLeveledUp = previousLevel.value !== null && newStats.level > previousLevel.value
  const hasLeveledDown = previousLevel.value !== null && newStats.level < previousLevel.value

  if (hasLeveledUp && stats.value) {
    // 1. Termine la barre actuelle à 100%
    await animateXpBarTo(stats.value.xp_needed_this_level, 500)
    await wait(200)

    // 2. Passe au nouveau niveau, vide la barre, déclenche le popup
    stats.value = newStats
    displayedXp.value = 0
    triggerLevelUp()
    await wait(400)

    // 3. Remplit la nouvelle barre depuis 0
    await animateXpBarTo(newStats.current_xp_in_level, 900)

  } else if (hasLeveledDown && stats.value) {
    // 1. Vide la barre actuelle jusqu'à 0
    await animateXpBarTo(0, 500)
    await wait(200)

    // 2. Repasse à l'ancien niveau, remplit la barre à 100%, déclenche le popup de régression
    stats.value = newStats
    displayedXp.value = newStats.xp_needed_this_level
    triggerLevelDown()
    await wait(400)

    // 3. Vide progressivement vers la nouvelle valeur réelle
    await animateXpBarTo(newStats.current_xp_in_level, 900)

  } else {
    stats.value = newStats
    await animateXpBarTo(newStats.current_xp_in_level)
  }

  previousLevel.value = newStats.level
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

defineExpose({ loadStats })

onMounted(loadStats)
</script>

<template>
  <div class="character-card" v-if="stats">
    <h2>Personnage</h2>

    <div class="character-visual">
      <Transition name="rank-fade" mode="out-in">
        <img :key="stats.rank" :src="characterImage" :alt="stats.rank" class="character-img" />
      </Transition>

      <Transition name="levelup-pop">
        <div v-if="showLevelUp" class="level-up-badge">
          🎉 Niveau {{ stats.level }} !
        </div>
      </Transition>

      <Transition name="levelup-pop">
        <div v-if="showLevelDown" class="level-down-badge">
          📉 Niveau {{ stats.level }}
        </div>
      </Transition>
    </div>

    <p class="level-label">Niveau actuel : <strong>{{ stats.level }}</strong></p>

    <div class="xp-bar-container">
      <div class="xp-bar-fill" :style="{ width: xpPercent + '%' }"></div>
      <span class="xp-bar-text">
        {{ Math.round(displayedXp) }} / {{ stats.xp_needed_this_level }} XP
      </span>
    </div>

    <p class="total-xp">XP total cumulé : {{ stats.total_xp }}</p>
  </div>
</template>

<style scoped>
.character-card {
  max-width: 320px;
  margin: 1rem auto;
  padding: 1.5rem;
  border-radius: 12px;
  background: #fafafa;
  border: 1px solid #e5e5e5;
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
  transition: width 0.1s linear; /* le vrai easing est géré par JS via requestAnimationFrame */
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

/* Transition de changement de rang (fondu) */
.rank-fade-enter-active,
.rank-fade-leave-active {
  transition: opacity 0.4s ease;
}
.rank-fade-enter-from,
.rank-fade-leave-to {
  opacity: 0;
}

/* Animation du popup de level-up */
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
