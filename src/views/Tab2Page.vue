<template>
  <ion-page>
    <ion-header class="custom-header">
      <ion-toolbar>
        <ion-title>Library</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding custom-content">
      <div class="page-header">
        <h2>
          <ion-icon :icon="libraryOutline" />
          Your Books
        </h2>
        <div v-if="!state.loading && !state.error && state.books.length > 0" class="book-count-badge">
          {{ state.books.length }} {{ state.books.length === 1 ? 'book' : 'books' }}
        </div>
      </div>
      
      <div v-if="state.loading" class="loading-state">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Loading your library...</p>
      </div>
      
      <div v-else-if="state.error" class="error-state">
        <ion-icon :icon="alertCircleOutline" class="error-icon" />
        <h3>Oops! Something went wrong</h3>
        <p class="error-text">{{ state.error }}</p>
        <p class="error-hint">
          Please check if the API server is running at http://localhost/elibrary_api
        </p>
        <ion-button fill="outline" @click="loadBooks" class="retry-button">
          <ion-icon :icon="refreshOutline" slot="start" />
          Try Again
        </ion-button>
      </div>
      
      <div v-else-if="state.books.length === 0" class="empty-state">
        <ion-icon :icon="libraryOutline" class="empty-icon" />
        <h3>Your library is empty</h3>
        <p>Start building your collection by adding your first book!</p>
        <ion-button router-link="/tabs/tab3" router-direction="forward" class="add-first-button">
          <ion-icon :icon="addCircleOutline" slot="start" />
          Add Your First Book
        </ion-button>
      </div>

      <ion-list v-else class="books-list">
        <BookItem
          v-for="book in state.books"
          :key="book.id"
          :book="book"
          @edit="openEdit"
          @delete="onDelete"
        />
      </ion-list>

      <!-- Edit Book Modal -->
      <ion-modal :is-open="state.isEditOpen" @didDismiss="closeEdit" class="edit-modal">
        <ion-header class="modal-header">
          <ion-toolbar>
            <ion-title>
              <ion-icon :icon="createOutline" />
              Edit Book
            </ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeEdit" fill="clear">
                <ion-icon :icon="closeOutline" />
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding modal-content">
          <form @submit.prevent="saveEdit">
            <ion-list class="form-list">
              <ion-item class="form-item">
                <ion-label position="stacked">
                  <ion-icon :icon="bookOutline" slot="start" />
                  Title
                </ion-label>
                <ion-input
                  v-model="editForm.title"
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
                  v-model="editForm.author"
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
                  v-model.number="editForm.year"
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
                  v-model="editForm.category"
                  placeholder="e.g. Programming, Novel..."
                  required
                />
              </ion-item>

              <ion-item class="form-item">
                <ion-label position="stacked">
                  <ion-icon :icon="checkmarkCircleOutline" slot="start" />
                  Availability
                </ion-label>
                <ion-select v-model="editForm.isAvailable" interface="popover">
                  <ion-select-option :value="1">Available</ion-select-option>
                  <ion-select-option :value="0">Borrowed</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>

            <div class="modal-buttons">
              <ion-button
                type="submit"
                expand="block"
                :disabled="state.isSaving"
                class="save-button"
              >
                <ion-icon :icon="state.isSaving ? hourglassOutline : checkmarkOutline" slot="start" />
                {{ state.isSaving ? 'Saving...' : 'Save Changes' }}
              </ion-button>

              <ion-button
                expand="block"
                fill="outline"
                color="medium"
                @click="closeEdit"
                class="cancel-button"
              >
                Cancel
              </ion-button>
            </div>

            <div v-if="state.editError" class="error-message">
              <ion-icon :icon="alertCircleOutline" />
              <p>{{ state.editError }}</p>
            </div>
          </form>
        </ion-content>
      </ion-modal>
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
  IonButton,
  IonButtons,
  IonIcon,
  IonSpinner,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption,
  onIonViewWillEnter,
} from '@ionic/vue'

import {
  libraryOutline,
  alertCircleOutline,
  refreshOutline,
  addCircleOutline,
  createOutline,
  closeOutline,
  bookOutline,
  personOutline,
  calendarOutline,
  pricetagOutline,
  checkmarkCircleOutline,
  checkmarkOutline,
  hourglassOutline,
} from 'ionicons/icons'

import { reactive } from 'vue'
import { getBooks, deleteBook, updateBook } from '@/services/BookService'
import BookItem from '@/components/BookItem.vue'

// All state in one reactive object
const state = reactive({
  books: [] as any[],
  error: null as string | null,
  loading: true as boolean,
  isEditOpen: false,
  isSaving: false,
  editError: '' as string,
})

// Form for editing selected book
const editForm = reactive({
  id: 0,
  title: '',
  author: '',
  year: new Date().getFullYear(),
  category: '',
  isAvailable: 1 as number | boolean,
})

// Load / reload books
async function loadBooks() {
  try {
    state.loading = true
    state.error = null
    const data = await getBooks()

    if (Array.isArray(data)) {
      state.books = data
    } else {
      state.books = []
      console.warn('Unexpected response format:', data)
    }
  } catch (err) {
    state.error = err instanceof Error ? err.message : 'Failed to load books'
    console.error('Error loading books:', err)
    state.books = []
  } finally {
    state.loading = false
  }
}

onIonViewWillEnter(loadBooks)

// Open modal and populate form
function openEdit(book: any) {
  state.editError = ''
  editForm.id = book.id
  editForm.title = book.title
  editForm.author = book.author
  editForm.year = Number(book.year)
  editForm.category = book.category
  editForm.isAvailable =
    book.isAvailable === 1 || book.isAvailable === '1' || book.isAvailable === true
      ? 1
      : 0

  state.isEditOpen = true
}

// Close modal
function closeEdit() {
  state.isEditOpen = false
  state.editError = ''
}

// Save changes
async function saveEdit() {
  state.editError = ''

  if (!editForm.title || !editForm.author || !editForm.year || !editForm.category) {
    state.editError = 'Please fill in all fields.'
    return
  }

  try {
    state.isSaving = true
    const response = await updateBook(editForm)

    if (response.status === 'success') {
      await loadBooks()
      state.isEditOpen = false
    } else {
      console.error('Update failed:', response)
      state.editError = 'Failed to update book.'
    }
  } catch (err) {
    console.error('Error updating book:', err)
    state.editError = 'An error occurred while updating.'
  } finally {
    state.isSaving = false
  }
}

// Delete book
async function onDelete(id: number) {
  const confirmed = window.confirm('Are you sure you want to delete this book?')
  if (!confirmed) return

  try {
    state.loading = true
    const response = await deleteBook(id)

    if (response.status === 'success') {
      await loadBooks()
    } else {
      console.error('Delete failed:', response)
      state.error = 'Failed to delete book.'
    }
  } catch (err) {
    console.error('Error deleting book:', err)
    state.error = 'An error occurred while deleting.'
  } finally {
    state.loading = false
  }
}
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.page-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header h2 ion-icon {
  font-size: 28px;
  color: #667eea;
  -webkit-text-fill-color: #667eea;
}

.book-count-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  min-height: 300px;
}

.loading-state ion-spinner {
  margin-bottom: 20px;
  --color: #667eea;
}

.loading-state p {
  color: #6b7280;
  font-size: 1rem;
  margin-top: 12px;
}

.error-icon,
.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  opacity: 0.3;
}

.error-icon {
  color: #ef4444;
}

.empty-icon {
  color: #667eea;
}

.error-state h3,
.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1f2937;
}

.error-text {
  color: #ef4444;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.error-hint {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 24px;
  max-width: 400px;
}

.retry-button {
  --border-radius: 12px;
  margin-top: 8px;
}

.empty-state p {
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 24px;
  max-width: 300px;
}

.add-first-button {
  --border-radius: 12px;
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.books-list {
  background: transparent;
  padding: 0;
}

.books-list ion-item {
  --background: white;
  --border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 12px;
  transition: all 0.2s ease;
}

.books-list ion-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* Modal Styles */
.edit-modal {
  --width: 90%;
  --max-width: 500px;
  --border-radius: 20px;
}

.modal-header {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.modal-header ion-toolbar {
  --color: white;
}

.modal-header ion-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-content {
  --background: #ffffff;
  --padding-start: 24px;
  --padding-end: 24px;
  --padding-top: 24px;
  --padding-bottom: 24px;
}

.form-list {
  background: transparent;
  padding: 0;
}

.form-item {
  --background: #f9fafb;
  --border-radius: 12px;
  margin-bottom: 16px;
  --padding-start: 16px;
  --padding-end: 16px;
  --inner-padding-end: 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.form-item ion-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.form-item ion-label ion-icon {
  font-size: 18px;
  color: #667eea;
}

.form-item ion-input,
.form-item ion-select {
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-buttons {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.save-button {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --border-radius: 12px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.cancel-button {
  --border-radius: 12px;
  --padding-top: 14px;
  --padding-bottom: 14px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background: #fee2e2;
  border-radius: 8px;
  border-left: 4px solid #ef4444;
}

.error-message ion-icon {
  color: #ef4444;
  font-size: 20px;
  flex-shrink: 0;
}

.error-message p {
  color: #dc2626;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .custom-content {
    --background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
  }

  .page-header {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .page-header h2 {
    background: linear-gradient(135deg, #8b9aff 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-header h2 ion-icon {
    color: #8b9aff;
    -webkit-text-fill-color: #8b9aff;
  }

  .error-state h3,
  .empty-state h3 {
    color: #f3f4f6;
  }

  .error-hint,
  .empty-state p {
    color: #9ca3af;
  }

  .books-list ion-item {
    --background: #2d2d2d;
    border-color: rgba(255, 255, 255, 0.1);
  }

  .modal-content {
    --background: #2d2d2d;
  }

  .form-item {
    --background: #1f1f1f;
    border-color: rgba(255, 255, 255, 0.1);
  }

  .form-item ion-label {
    color: #e5e7eb;
  }

  .form-item ion-input,
  .form-item ion-select {
    --background: #2d2d2d;
    border-color: rgba(255, 255, 255, 0.1);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .book-count-badge {
    align-self: flex-end;
  }
}
</style>
