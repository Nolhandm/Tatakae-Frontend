<script setup>
import { ref, onMounted, watch } from 'vue'
import {
  getAllQuests,
  getAllCheckedQuestIds,
  checkQuest,
  uncheckQuest
} from '../services/questsService.ts'
import CharacterComponent from '@/components/CharacterComponent.vue'
import DeleteQuestButton from '../components/DeleteQuestButton.vue'

// ---------------------------------------------
// ----------- État réactif --------------------
// ---------------------------------------------
const actualDate = ref(toDateInputString(new Date()))
const quests = ref([])
const checkedQuestIds = ref(new Set())
const loading = ref(true)
const characterRef = ref(null)

// ---------------------------------------------
// ---------------- Fonctions ------------------
// ---------------------------------------------
function toDateInputString(dateObj) {
  return dateObj.toISOString().split('T')[0] // format YYYY-MM-DD attendu par <input type="date">
}

function shiftDate(days) {
  const current = new Date(actualDate.value)
  current.setDate(current.getDate() + days)
  actualDate.value = toDateInputString(current)
}

function previousDate() {
  shiftDate(-1)
}

function nextDate() {
  shiftDate(1)
}

async function loadQuests() {
  quests.value = await getAllQuests()
}

async function syncCheckboxes() {
  const ids = await getAllCheckedQuestIds(actualDate.value)
  checkedQuestIds.value = new Set(ids)
}

async function toggleQuest(quest) {
  const isCurrentlyChecked = checkedQuestIds.value.has(quest.quest_id)

  // Optimistic update : on met à jour l'UI avant la réponse serveur pour que ce soit instantané
  if (isCurrentlyChecked) {
    checkedQuestIds.value.delete(quest.quest_id)
  } else {
    checkedQuestIds.value.add(quest.quest_id)
  }
  checkedQuestIds.value = new Set(checkedQuestIds.value) // force la réactivité (Set n'est pas trackée nativement)

  try {
    if (isCurrentlyChecked) {
      await uncheckQuest(quest.quest_id, actualDate.value)
    } else {
      await checkQuest(quest.quest_id, actualDate.value)
    }
    await characterRef.value?.loadStats()
  } catch (err) {
    // rollback si l'appel API échoue
    if (isCurrentlyChecked) {
      checkedQuestIds.value.add(quest.quest_id)
    } else {
      checkedQuestIds.value.delete(quest.quest_id)
    }
    checkedQuestIds.value = new Set(checkedQuestIds.value)
    console.error(err)
  }
}

// Recharge automatiquement les validations dès que la date change
watch(actualDate, syncCheckboxes)

onMounted(async () => {
  loading.value = true
  await loadQuests()
  await syncCheckboxes()
  loading.value = false
})

function handleQuestDeleted(questId) {
  quests.value = quests.value.filter(h => h.quest_id !== questId)
}

</script>

<template>
  <div class="quest-tracker">
    <h1>📅 Suivi des Quêtes</h1>

    <!-- Système de date -->
    <div class="date-nav">
      <button class="nav-btn" @click="previousDate">◀</button>
      <input type="date" v-model="actualDate" class="date-picker" />
      <button class="nav-btn" @click="nextDate">▶</button>
    </div>

    <hr />

    <!-- Liste des Quêtes -->
    <h2>✅ Liste des quêtes</h2>

    <p v-if="loading">Chargement...</p>

    <div v-else class="quest-list">
      <div v-for="quest in quests" :key="quest.quest_id" class="quest-row">
        <div class="quest-name">{{ quest.name }}</div>
        <div class="quest-info">
          ⏱️ {{ quest.time_coeff }}min | ⚡ {{ quest.difficulty_coeff }}/10
        </div>
        <div class="quest-check">
          <input
            type="checkbox"
            :checked="checkedQuestIds.has(quest.quest_id)"
            @change="toggleQuest(quest)"
          />
          <DeleteQuestButton :questId="quest.quest_id" @deleted="handleQuestDeleted" @error="console.error"/>
        </div>
      </div>
    </div>

    <CharacterComponent ref="characterRef"/>
  </div>
</template>

<style scoped>
.date-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
}

.nav-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}
.nav-btn:hover {
  background: #f5f5f5;
}

.date-picker {
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: center;
}

.quest-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quest-row {
  display: grid;
  grid-template-columns: 0.7fr 0.2fr 0.1fr;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border: 1px solid #eee;
  border-radius: 6px;
}

.quest-info {
  font-size: 0.85rem;
  color: #666;
}

.quest-check {
  display: flex;
  justify-content: center;
}

.quest-check input[type='checkbox'] {
  width: 1.3rem;
  height: 1.3rem;
  cursor: pointer;
}
</style>
