<template>
  <ion-page>
    <ion-header class="custom-header">
      <ion-toolbar>
        <ion-title>
          <ion-icon :icon="addCircleOutline" />
          Add New Book
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding custom-content">
      <div class="page-intro">
        <h2>Add to Your Library</h2>
        <p>Fill in the details below to add a new book to your collection.</p>
      </div>

      <form @submit.prevent="onSubmit" class="book-form">
        <ion-list class="form-list">
          <ion-item class="form-item">
            <ion-label position="stacked">
              <ion-icon :icon="bookOutline" slot="start" />
              Title
            </ion-label>
            <ion-input
              v-model="form.title"
              placeholder="Enter book title"
              required
            />
          </ion-item>

          <ion-item class="form-item">
            <ion-label position="stacked">
              <ion-icon :icon="personOutline" slot="start" />
              Author
            </ion-label>
            <ion-input
              v-model="form.author"
              placeholder="Enter author name"
              required
            />
          </ion-item>

          <ion-item class="form-item">
            <ion-label position="stacked">
              <ion-icon :icon="calendarOutline" slot="start" />
              Year
            </ion-label>
            <ion-input
              type="number"
              v-model.number="form.year"
              placeholder="e.g. 2020"
              required
            />
          </ion-item>

          <ion-item class="form-item">
            <ion-label position="stacked">
              <ion-icon :icon="pricetagOutline" slot="start" />
              Category
            </ion-label>
            <ion-input
              v-model="form.category"
              placeholder="e.g. Programming, Novel..."
              required
            />
          </ion-item>

          <ion-item class="form-item">
            <ion-label position="stacked">
              <ion-icon :icon="checkmarkCircleOutline" slot="start" />
              Availability
            </ion-label>
            <ion-select v-model="form.isAvailable" interface="popover">
              <ion-select-option :value="1">Available</ion-select-option>
              <ion-select-option :value="0">Borrowed</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>

        <div class="form-buttons">
          <ion-button
            type="submit"
            expand="block"
            :disabled="state.isSubmitting"
            class="submit-button"
          >
            <ion-icon :icon="state.isSubmitting ? hourglassOutline : checkmarkCircleOutline" slot="start" />
            {{ state.isSubmitting ? 'Saving...' : 'Add Book' }}
          </ion-button>
        </div>

        <div v-if="state.successMessage" class="success-message">
          <ion-icon :icon="checkmarkCircleOutline" />
          <p>{{ state.successMessage }}</p>
        </div>

        <div v-if="state.errorMessage" class="error-message">
          <ion-icon :icon="alertCircleOutline" />
          <p>{{ state.errorMessage }}</p>
        </div>
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
  IonIcon,
  IonSelect,
  IonSelectOption,
} from '@ionic/vue'

import {
  addCircleOutline,
  bookOutline,
  personOutline,
  calendarOutline,
  pricetagOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  hourglassOutline,
} from 'ionicons/icons'

import { reactive } from 'vue'
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
.custom-header {
  --background: linear-gradient(135deg, #6b9bd4 0%, #5a8bc4 100%);
}

.custom-header ion-toolbar {
  --color: white;
}

.custom-header ion-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-content {
  --background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
  --padding-start: 20px;
  --padding-end: 20px;
  --padding-top: 24px;
  --padding-bottom: 24px;
}

.page-intro {
  text-align: center;
  margin-bottom: 32px;
  padding: 0 8px;
}

.page-intro h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #6b9bd4 0%, #5a8bc4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-intro p {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
}

.book-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-list {
  background: transparent;
  padding: 0;
  margin-bottom: 24px;
}

.form-item {
  --background: #f9fafb;
  --border-radius: 12px;
  margin-bottom: 20px;
  --padding-start: 16px;
  --padding-end: 16px;
  --inner-padding-end: 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.form-item:focus-within {
  --background: #ffffff;
  border-color: #6b9bd4;
  box-shadow: 0 0 0 3px rgba(107, 155, 212, 0.1);
  transform: translateY(-1px);
}

.form-item ion-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
  font-size: 0.95rem;
}

.form-item ion-label ion-icon {
  font-size: 18px;
  color: #5a8bc4;
}

.form-item ion-input,
.form-item ion-select {
  --padding-start: 14px;
  --padding-end: 14px;
  --padding-top: 14px;
  --padding-bottom: 14px;
  background: white;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-item ion-input:focus,
.form-item ion-select:focus {
  border-color: #6b9bd4;
  box-shadow: 0 0 0 2px rgba(107, 155, 212, 0.2);
}

.form-buttons {
  margin-top: 8px;
}

.submit-button {
  --background: linear-gradient(135deg, #6b9bd4 0%, #5a8bc4 100%);
  --border-radius: 12px;
  --padding-top: 18px;
  --padding-bottom: 18px;
  font-weight: 600;
  font-size: 1.05rem;
  text-transform: none;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 16px rgba(90, 139, 196, 0.3);
  transition: all 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(90, 139, 196, 0.4);
}

.submit-button:disabled {
  opacity: 0.7;
}

.submit-button ion-icon {
  font-size: 22px;
}

.success-message,
.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding: 16px;
  border-radius: 12px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-message {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-left: 4px solid #10b981;
  color: #065f46;
}

.success-message ion-icon {
  font-size: 24px;
  color: #10b981;
  flex-shrink: 0;
}

.success-message p {
  color: #065f46;
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
  flex: 1;
}

.error-message {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-left: 4px solid #ef4444;
  color: #991b1b;
}

.error-message ion-icon {
  font-size: 24px;
  color: #ef4444;
  flex-shrink: 0;
}

.error-message p {
  color: #991b1b;
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
  flex: 1;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .custom-content {
    --background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
  }

  .page-intro h2 {
    background: linear-gradient(135deg, #7ba3d6 0%, #6b93c6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-intro p {
    color: #9ca3af;
  }

  .form-item {
    --background: #1f1f1f;
    border-color: rgba(255, 255, 255, 0.1);
  }

  .form-item:focus-within {
    --background: #2d2d2d;
    border-color: #7ba3d6;
  }

  .form-item ion-label {
    color: #e5e7eb;
  }

  .form-item ion-label ion-icon {
    color: #6b93c6;
  }

  .form-item ion-input,
  .form-item ion-select {
    --background: #2d2d2d;
    border-color: rgba(255, 255, 255, 0.1);
    color: #f3f4f6;
  }

  .form-item ion-input:focus,
  .form-item ion-select:focus {
    border-color: #7ba3d6;
  }

  .success-message {
    background: rgba(16, 185, 129, 0.15);
    border-left-color: #10b981;
  }

  .success-message p {
    color: #6ee7b7;
  }

  .error-message {
    background: rgba(239, 68, 68, 0.15);
    border-left-color: #ef4444;
  }

  .error-message p {
    color: #fca5a5;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .page-intro h2 {
    font-size: 1.5rem;
  }

  .form-item {
    margin-bottom: 16px;
  }
}
</style>
