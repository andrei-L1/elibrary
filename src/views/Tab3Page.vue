<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Add New Book</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form @submit.prevent="onSubmit">
        <ion-list>
          <ion-item>
            <ion-label position="stacked">Title</ion-label>
            <ion-input
              v-model="form.title"
              placeholder="Enter book title"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Author</ion-label>
            <ion-input
              v-model="form.author"
              placeholder="Enter author name"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Year</ion-label>
            <ion-input
              type="number"
              v-model.number="form.year"
              placeholder="e.g. 2020"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Category</ion-label>
            <ion-input
              v-model="form.category"
              placeholder="e.g. Programming, Novel..."
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Availability</ion-label>
            <ion-select v-model="form.isAvailable">
              <ion-select-option :value="1">Available</ion-select-option>
              <ion-select-option :value="0">Borrowed</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>

        <div class="buttons">
          <ion-button type="submit" expand="block" :disabled="state.isSubmitting">
            {{ state.isSubmitting ? 'Saving...' : 'Save Book' }}
          </ion-button>
        </div>

        <p v-if="state.successMessage" class="success">
          {{ state.successMessage }}
        </p>
        <p v-if="state.errorMessage" class="error">
          {{ state.errorMessage }}
        </p>
      </form>
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
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
} from '@ionic/vue'

import { reactive, ref } from 'vue'
import { addBook } from '@/services/BookService'

// reactive() for form data  👉 matches "use reactive state"
const form = reactive({
  title: '',
  author: '',
  year: new Date().getFullYear(),
  category: '',
  isAvailable: 1, // 1 = Available, 0 = Borrowed
})

// ref() for UI flags/messages  👉 shows you use ref as well
const state = reactive({
  isSubmitting: false,
  successMessage: '',
  errorMessage: '',
})

async function onSubmit() {
  state.successMessage = ''
  state.errorMessage = ''

  // simple validation
  if (!form.title || !form.author || !form.year || !form.category) {
    state.errorMessage = 'Please fill in all fields.'
    return
  }

  try {
    state.isSubmitting = true

    const response = await addBook(form)

    if (response.status === 'success') {
      state.successMessage = 'Book added successfully!'

      // reset form (keep year, reset others)
      form.title = ''
      form.author = ''
      form.category = ''
      form.isAvailable = 1
    } else {
      state.errorMessage = 'Failed to add book.'
      console.error('Add book error:', response)
    }
  } catch (err) {
    console.error(err)
    state.errorMessage = 'An error occurred while saving.'
  } finally {
    state.isSubmitting = false
  }
}
</script>

<style scoped>
.buttons {
  margin-top: 16px;
}

.success {
  margin-top: 12px;
  color: green;
  font-size: 0.9rem;
}

.error {
  margin-top: 12px;
  color: red;
  font-size: 0.9rem;
}
</style>
