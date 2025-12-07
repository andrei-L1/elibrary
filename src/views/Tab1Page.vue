<template>
  <ion-page>
    <ion-header class="custom-header">
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding custom-content">
      <section class="hero">
        <div class="hero-icon">
          <ion-icon :icon="libraryOutline" />
        </div>
        <h1>eLibrary</h1>
        <p class="subtitle">
          Manage your personal book collection easily.
        </p>
      </section>

      <ion-card class="overview-card">
        <ion-card-header>
          <div class="card-header-content">
            <ion-icon :icon="statsChartOutline" class="card-icon" />
            <ion-card-title>Library Overview</ion-card-title>
          </div>
        </ion-card-header>
        <ion-card-content>
          <div v-if="state.loading" class="loading-state">
            <ion-spinner name="crescent"></ion-spinner>
            <p>Loading summary...</p>
          </div>
          <div v-else-if="state.error" class="error-state">
            <ion-icon :icon="alertCircleOutline" class="error-icon" />
            <p class="error">{{ state.error }}</p>
          </div>
          <div v-else class="stats-display">
            <div class="book-count">
              <span class="count-number">{{ state.totalBooks }}</span>
              <span class="count-label">
                book{{ state.totalBooks === 1 ? '' : 's' }}
              </span>
            </div>
            <p class="stats-text">in your library</p>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-card class="actions-card">
        <ion-card-header>
          <div class="card-header-content">
            <ion-icon :icon="rocketOutline" class="card-icon" />
            <ion-card-title>Get Started</ion-card-title>
          </div>
        </ion-card-header>
        <ion-card-content>
          <p class="card-description">
            Use the options below to view your books or add a new one.
          </p>

          <div class="buttons">
            <ion-button
              expand="block"
              router-link="/tabs/tab2"
              router-direction="forward"
              class="action-button primary-button"
            >
              <ion-icon :icon="libraryOutline" slot="start" />
              View Library
            </ion-button>

            <ion-button
              expand="block"
              color="secondary"
              router-link="/tabs/tab3"
              router-direction="forward"
              class="action-button secondary-button"
            >
              <ion-icon :icon="addCircleOutline" slot="start" />
              Add New Book
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>

      <p class="footer-hint">
        <ion-icon :icon="informationCircleOutline" />
        You can also use the tabs at the bottom to navigate between pages.
      </p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonSpinner,
  onIonViewWillEnter,
} from '@ionic/vue'

import {
  libraryOutline,
  statsChartOutline,
  rocketOutline,
  addCircleOutline,
  alertCircleOutline,
  informationCircleOutline,
} from 'ionicons/icons'

import { reactive } from 'vue'
import { getBooks } from '@/services/BookService'

// reactive state for the summary
const state = reactive({
  totalBooks: 0,
  loading: true,
  error: '' as string,
})

async function loadSummary() {
  try {
    state.loading = true
    state.error = ''
    const data = await getBooks()

    if (Array.isArray(data)) {
      state.totalBooks = data.length
    } else {
      state.totalBooks = 0
      console.warn('Unexpected summary response:', data)
    }
  } catch (err) {
    console.error('Error loading summary:', err)
    state.error = 'Failed to load summary.'
    state.totalBooks = 0
  } finally {
    state.loading = false
  }
}

// refresh summary whenever Home becomes active
onIonViewWillEnter(loadSummary)
</script>

<style scoped>
.custom-header {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.custom-header ion-toolbar {
  --color: white;
}

.custom-content {
  --background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
  --padding-start: 20px;
  --padding-end: 20px;
  --padding-top: 24px;
  --padding-bottom: 24px;
}

.hero {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px 0;
}

.hero-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  animation: float 3s ease-in-out infinite;
}

.hero-icon ion-icon {
  font-size: 40px;
  color: white;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1rem;
  color: #6b7280;
  font-weight: 400;
  margin-top: 8px;
}

.overview-card,
.actions-card {
  margin-bottom: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.overview-card:hover,
.actions-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  font-size: 24px;
  color: #667eea;
}

ion-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.card-description {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 0;
}

.loading-state p {
  color: #6b7280;
  font-size: 0.9rem;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 0;
}

.error-icon {
  font-size: 48px;
  color: #ef4444;
}

.error {
  color: #ef4444;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
}

.stats-display {
  text-align: center;
  padding: 16px 0;
}

.book-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.count-number {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.count-label {
  font-size: 1.1rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stats-text {
  color: #9ca3af;
  font-size: 0.9rem;
  margin-top: 8px;
}

.buttons {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-button {
  --border-radius: 12px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  font-weight: 600;
  font-size: 1rem;
  text-transform: none;
  letter-spacing: 0.3px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.primary-button {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --background-hover: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
}

.secondary-button {
  --background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --background-hover: linear-gradient(135deg, #e082ea 0%, #e4465b 100%);
}

.action-button ion-icon {
  font-size: 20px;
  margin-right: 4px;
}

.footer-hint {
  margin-top: 32px;
  font-size: 0.85rem;
  color: #9ca3af;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 16px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
}

.footer-hint ion-icon {
  font-size: 18px;
  color: #667eea;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .custom-content {
    --background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
  }

  .hero h1 {
    background: linear-gradient(135deg, #8b9aff 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    color: #9ca3af;
  }

  .overview-card,
  .actions-card {
    --background: #2d2d2d;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  ion-card-title {
    color: #f3f4f6;
  }

  .card-description {
    color: #9ca3af;
  }

  .count-label {
    color: #9ca3af;
  }

  .stats-text {
    color: #6b7280;
  }

  .footer-hint {
    background: rgba(139, 154, 255, 0.1);
    color: #9ca3af;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .count-number {
    font-size: 3rem;
  }
}
</style>
