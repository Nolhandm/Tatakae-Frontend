<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/" class="nav-link">🏠 Accueil</RouterLink>
    <RouterLink to="/habitudes" class="nav-link">✅ Quêtes</RouterLink>
    <RouterLink to="/dashboard" class="nav-link">📊 Dashboard</RouterLink>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background: #1e1b4b;
  align-items: center;
}

.nav-link {
  color: #c7d2fe;
  text-decoration: none;
  font-weight: 500;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-link:hover {
  background: #312e81;
  color: white;
}

/* Vue Router ajoute automatiquement cette classe sur le lien actif */
.nav-link.router-link-active {
  background: #4f46e5;
  color: white;
}
</style>
