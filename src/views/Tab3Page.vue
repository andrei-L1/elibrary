<template>
  <ion-page>


    <ion-content class="content" :scroll-y="false">
      <form @submit.prevent="onSubmit" class="form">
        <div class="form-intro">
          <div class="icon-wrapper">
            <ion-icon :icon="bookOutline" class="main-icon" />
          </div>
          <h1 class="form-title">Add New Book</h1>
          <p class="form-subtitle">Fill in the book details below</p>
        </div>

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
            class="submit-btn"
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
  IonButton,
  IonIcon,
  IonInput,
  IonBackButton,
  IonButtons,
  IonSpinner,
} from '@ionic/vue'

import {
  addCircleOutline,
  bookOutline,
  personOutline,
  calendarOutline,
  pricetagOutline,
  checkmarkCircleOutline,
  checkmark,
  alertCircleOutline,
  hourglassOutline,
  timeOutline,
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
.header {
  --background: #ffffff;
}

.header ion-toolbar {
  --background: #ffffff;
  --border-color: transparent;
  --min-height: 64px;
  --padding-top: 4px;
  --padding-bottom: 4px;
}

.back-button {
  --color: #1a1a1a;
  --icon-margin-start: 0;
  --icon-margin-end: 0;
  --icon-font-size: 24px;
}

.page-title {
  color: #1a1a1a;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.2px;
}

.header-button {
  --color: #667eea;
  --background: transparent;
  --background-activated: rgba(102, 126, 234, 0.1);
  --background-focused: rgba(102, 126, 234, 0.1);
  --border-radius: 10px;
  width: 40px;
  height: 40px;
  margin-right: 4px;
}

.content {
  --background: #ffffff;
  --padding-start: 20px;
  --padding-end: 20px;
  --padding-top: 0;
  --padding-bottom: 32px;
}

.form {
  max-width: 500px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 16px;
}

.form-intro {
  text-align: center;
  margin-bottom: 40px;
  padding: 0 8px;
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.15);
  position: relative;
  overflow: hidden;
}

.icon-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
}

.main-icon {
  font-size: 28px;
  color: white;
  position: relative;
  z-index: 1;
}

.form-title {
  font-size: 26px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  letter-spacing: -0.3px;
}

.form-subtitle {
  color: #6b7280;
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
  font-weight: 400;
}

.fields-container {
  margin-bottom: 32px;
}

.field {
  margin-bottom: 20px;
}

.field:last-child {
  margin-bottom: 0;
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
  --padding-top: 16px;
  --padding-bottom: 16px;
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
  padding: 0 4px;
}

.submit-btn {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --background-activated: linear-gradient(135deg, #5a6fd8 0%, #6a4090 100%);
  --background-focused: linear-gradient(135deg, #5a6fd8 0%, #6a4090 100%);
  --border-radius: 14px;
  --padding-top: 20px;
  --padding-bottom: 20px;
  --box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
  height: 56px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.submit-btn:not(:disabled):hover {
  --box-shadow: 0 6px 28px rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

.submit-btn:not(:disabled):active {
  transform: translateY(0);
}

.submit-btn:disabled {
  --background: #e5e7eb;
  --box-shadow: none;
  opacity: 0.7;
}

.btn-icon {
  font-size: 20px;
  margin-right: 8px;
}

.btn-text {
  font-size: 16px;
  font-weight: 600;
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

/* Responsive adjustments */
@media (max-width: 640px) {
  .content {
    --padding-start: 16px;
    --padding-end: 16px;
  }
  
  .row-fields {
    flex-direction: column;
    gap: 20px;
  }
  
  .icon-wrapper {
    width: 56px;
    height: 56px;
    border-radius: 16px;
  }
  
  .main-icon {
    font-size: 24px;
  }
  
  .form-title {
    font-size: 24px;
  }
  
  .form-subtitle {
    font-size: 14px;
  }
  
  .submit-btn {
    height: 52px;
    --padding-top: 18px;
    --padding-bottom: 18px;
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

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .header,
  .header ion-toolbar {
    --background: #0a0a0a;
  }
  
  .page-title {
    color: #ffffff;
  }
  
  .back-button {
    --color: #ffffff;
  }
  
  .header-button {
    --color: #818cf8;
  }
  
  .content {
    --background: #0a0a0a;
  }
  
  .form-title {
    color: #ffffff;
  }
  
  .form-subtitle {
    color: #9ca3af;
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
}
</style>