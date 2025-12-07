<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <section class="hero">
        <h1>eLibrary</h1>
        <p class="subtitle">
          Manage your personal book collection easily.
        </p>
      </section>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Library Overview</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p v-if="state.loading">Loading summary...</p>
          <p v-else-if="state.error" class="error">
            {{ state.error }}
          </p>
          <p v-else>
            You currently have
            <strong>{{ state.totalBooks }}</strong>
            book{{ state.totalBooks === 1 ? '' : 's' }} in your library.
          </p>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Get Started</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>
            Use the options below to view your books or add a new one.
          </p>

          <div class="buttons">
            <ion-button
              expand="block"
              router-link="/tabs/tab2"
              router-direction="forward"
            >
              View Books List
            </ion-button>

            <ion-button
              expand="block"
              color="secondary"
              router-link="/tabs/tab3"
              router-direction="forward"
            >
              Add New Book
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>

      <p class="footer-hint">
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
  onIonViewWillEnter,
} from '@ionic/vue'

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
.hero {
  text-align: center;
  margin-bottom: 16px;
}

.hero h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 0.95rem;
  color: #666;
}

.buttons {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-hint {
  margin-top: 16px;
  font-size: 0.85rem;
  color: #777;
  text-align: center;
}

.error {
  color: red;
  font-size: 0.9rem;
}
</style>
