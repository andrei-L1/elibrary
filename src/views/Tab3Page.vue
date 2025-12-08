<template>
  <ion-page>
    <ion-content class="ion-padding custom-content">
      <section class="hero">
        <div class="hero-icon">
          <ion-icon :icon="addCircleOutline" />
        </div>
        <h1>Add New Book</h1>
        <p class="subtitle">
          Fill in the book details below to add to your library.
        </p>
      </section>

      <ion-card class="form-card">
        <ion-card-header>
          <div class="card-header-content">
            <ion-card-title>Book Details</ion-card-title>
          </div>
        </ion-card-header>
        <ion-card-content>
          <form @submit.prevent="onSubmit" class="form">
            <div class="fields-container">
              <div class="field">
                <div class="field-label">
                  <ion-icon :icon="bookOutline" class="field-icon" />
                  <span>Title</span>
                </div>
                <ion-input
                  v-model="form.title"
                  placeholder="Book title"
                  class="input-field"
                  fill="solid"
                  required
                />
              </div>

              <div class="field">
                <div class="field-label">
                  <ion-icon :icon="personOutline" class="field-icon" />
                  <span>Author</span>
                </div>
                <ion-input
                  v-model="form.author"
                  placeholder="Author name"
                  class="input-field"
                  fill="solid"
                  required
                />
              </div>

              <div class="row-fields">
                <div class="field half">
                  <div class="field-label">
                    <ion-icon :icon="calendarOutline" class="field-icon" />
                    <span>Year</span>
                  </div>
                  <ion-input
                    type="number"
                    v-model.number="form.year"
                    placeholder="2024"
                    class="input-field"
                    fill="solid"
                    required
                  />
                </div>

                <div class="field half">
                  <div class="field-label">
                    <ion-icon :icon="pricetagOutline" class="field-icon" />
                    <span>Category</span>
                  </div>
                  <ion-input
                    v-model="form.category"
                    placeholder="Fiction, Non-fiction, etc."
                    class="input-field"
                    fill="solid"
                    required
                  />
                </div>
              </div>

              <div class="field">
                <div class="field-label">
                  <ion-icon :icon="checkmarkCircleOutline" class="field-icon" />
                  <span>Status</span>
                </div>
                <div class="toggle-buttons">
                  <button
                    type="button"
                    @click="form.isAvailable = 1"
                    :class="['toggle-button', { 'toggle-active': form.isAvailable === 1 }]"
                    :disabled="state.isSubmitting"
                  >
                    <ion-icon :icon="checkmarkCircleOutline" class="toggle-icon" />
                    <span>Available</span>
                  </button>
                  <button
                    type="button"
                    @click="form.isAvailable = 0"
                    :class="['toggle-button', { 'toggle-active': form.isAvailable === 0 }]"
                    :disabled="state.isSubmitting"
                  >
                    <ion-icon :icon="timeOutline" class="toggle-icon" />
                    <span>Borrowed</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="actions">
              <ion-button
                type="submit"
                expand="block"
                :disabled="state.isSubmitting"
                class="submit-btn primary-button"
              >
                <ion-spinner v-if="state.isSubmitting" name="crescent" class="spinner" />
                <ion-icon v-else :icon="addCircleOutline" slot="start" class="btn-icon" />
                <span class="btn-text">{{ state.isSubmitting ? 'Adding Book...' : 'Add to Library' }}</span>
              </ion-button>
            </div>

            <transition name="slide-fade">
              <div v-if="state.successMessage" class="notification success">
                <ion-icon :icon="checkmarkCircleOutline" class="notification-icon" />
                <span class="notification-text">{{ state.successMessage }}</span>
              </div>
            </transition>

            <transition name="slide-fade">
              <div v-if="state.errorMessage" class="notification error">
                <ion-icon :icon="alertCircleOutline" class="notification-icon" />
                <span class="notification-text">{{ state.errorMessage }}</span>
              </div>
            </transition>
          </form>
        </ion-card-content>
      </ion-card>

      <p class="footer-hint">
        <ion-icon :icon="informationCircleOutline" />
        All fields are required. Books will appear in your library immediately.
      </p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/vue'

import {
  addCircleOutline,
  bookOutline,
  personOutline,
  calendarOutline,
  pricetagOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  timeOutline,
  informationCircleOutline,
} from 'ionicons/icons'

import { reactive } from 'vue'
import { addBook } from '@/services/BookService'

const form = reactive({
  title: '',
  author: '',
  year: new Date().getFullYear(),
  category: '',
  isAvailable: 1,
})

const state = reactive({
  isSubmitting: false,
  successMessage: '',
  errorMessage: '',
})

async function onSubmit() {
  state.successMessage = ''
  state.errorMessage = ''

  if (!form.title.trim() || !form.author.trim() || !form.category.trim()) {
    state.errorMessage = 'Please fill in all required fields'
    return
  }

  try {
    state.isSubmitting = true
    const response = await addBook(form)

    if (response.status === 'success') {
      state.successMessage = 'Book added to your library'
      
      // Clear form after success
      setTimeout(() => {
        form.title = ''
        form.author = ''
        form.category = ''
        form.isAvailable = 1
      }, 1500)
    } else {
      state.errorMessage = 'Unable to add book. Please try again.'
    }
  } catch (err) {
    console.error(err)
    state.errorMessage = 'An error occurred while saving'
  } finally {
    state.isSubmitting = false
  }
}
</script>

<style scoped>
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

.form-card {
  margin-bottom: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.form-card:hover {
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

.form {
  width: 100%;
}

.fields-container {
  margin-bottom: 24px;
}

.field {
  margin-bottom: 24px;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding-left: 4px;
}

.field-icon {
  font-size: 18px;
  color: #667eea;
  opacity: 0.9;
}

.field-label span {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  letter-spacing: -0.1px;
}

.input-field {
  --background: #f8fafc;
  --border-radius: 12px;
  --border-color: transparent;
  --border-width: 0;
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 14px;
  --padding-bottom: 14px;
  --color: #1a1a1a;
  font-size: 16px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-field:hover {
  --background: #f1f5f9;
}

.input-field.ion-focused {
  --background: #ffffff;
  --border-color: #667eea;
  --border-width: 2px;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.row-fields {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.half {
  flex: 1;
}

.toggle-buttons {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}

.toggle-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.toggle-button:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

.toggle-button:active:not(:disabled) {
  transform: translateY(0);
}

.toggle-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-active {
  background: rgba(102, 126, 234, 0.08) !important;
  border-color: #667eea !important;
  color: #667eea !important;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.toggle-icon {
  font-size: 18px;
  opacity: 0.9;
}

.actions {
  margin-top: 32px;
}

.submit-btn {
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

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.primary-button {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --background-hover: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
}

.submit-btn:disabled {
  --background: #e5e7eb;
  --box-shadow: none;
  opacity: 0.7;
}

.btn-icon {
  font-size: 20px;
  margin-right: 4px;
}

.spinner {
  --color: white;
  margin-right: 12px;
}

.notification {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  margin-top: 20px;
  backdrop-filter: blur(10px);
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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

.success {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #065f46;
}

.error {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #991b1b;
}

.notification-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.success .notification-icon {
  color: #10b981;
}

.error .notification-icon {
  color: #ef4444;
}

.notification-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
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

/* Responsive design */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero-icon {
    width: 64px;
    height: 64px;
  }
  
  .hero-icon ion-icon {
    font-size: 32px;
  }
  
  .row-fields {
    flex-direction: column;
    gap: 20px;
  }
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

  .form-card {
    --background: #2d2d2d;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  ion-card-title {
    color: #f3f4f6;
  }

  .field-label span {
    color: #e5e7eb;
  }

  .input-field {
    --background: #1a1a1a;
    --color: #ffffff;
  }

  .input-field:hover {
    --background: #222222;
  }

  .input-field.ion-focused {
    --background: #1a1a1a;
    --border-color: #818cf8;
  }

  .toggle-button {
    background: #1a1a1a;
    border-color: #2a2a2a;
    color: #9ca3af;
  }

  .toggle-button:hover:not(:disabled) {
    background: #222222;
    border-color: #3a3a3a;
  }

  .toggle-active {
    background: rgba(99, 102, 241, 0.15) !important;
    border-color: #818cf8 !important;
    color: #818cf8 !important;
  }

  .primary-button {
    --background: linear-gradient(135deg, #8b9aff 0%, #a78bfa 100%);
    --background-hover: linear-gradient(135deg, #7c8aff 0%, #9579ea 100%);
  }

  .submit-btn:disabled {
    --background: #2a2a2a;
  }

  .success {
    background: rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.3);
    color: #a7f3d0;
  }

  .error {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
    color: #fecaca;
  }

  .footer-hint {
    background: rgba(139, 154, 255, 0.1);
    color: #9ca3af;
  }
}

/* Smooth scroll for mobile */
.content {
  -webkit-overflow-scrolling: touch;
}

/* Remove focus outline for mouse users */
@media (hover: hover) {
  .toggle-button:focus-visible,
  .submit-btn:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
}
</style>