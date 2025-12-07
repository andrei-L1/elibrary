<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Books List</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>Your Books</h2>
      
      <div v-if="state.loading" class="loading-message">
        <p>Loading books...</p>
      </div>
      
      <div v-else-if="state.error" class="error-message">
        <p style="color: red;">Error: {{ state.error }}</p>
        <p style="font-size: 0.85rem; color: #666;">
          Please check if the API server is running at http://localhost/elibrary_api
        </p>
      </div>
      
      <p v-else-if="state.books.length === 0">
        No books yet. Add some books to see them here.
      </p>

      <ion-list v-else>
        <ion-item v-for="book in state.books" :key="book.id">
          <ion-label>
            <h3>{{ book.title }}</h3>
            <p>Author: {{ book.author }}</p>
            <p>Year: {{ book.year }} · Category: {{ book.category }}</p>
            <p>Status: {{ book.isAvailable ? 'Available' : 'Borrowed' }}</p>
          </ion-label>

          <!-- Edit button -->
          <ion-button
            fill="outline"
            size="small"
            slot="end"
            @click="openEdit(book)"
          >
            Edit
          </ion-button>

          <!-- Delete button -->
          <ion-button
            color="danger"
            fill="outline"
            size="small"
            slot="end"
            @click="onDelete(book.id)"
          >
            Delete
          </ion-button>
        </ion-item>
      </ion-list>

      <!-- Edit Book Modal -->
      <ion-modal :is-open="state.isEditOpen" @didDismiss="closeEdit">
        <ion-header>
          <ion-toolbar>
            <ion-title>Edit Book</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <form @submit.prevent="saveEdit">
            <ion-list>
              <ion-item>
                <ion-label position="stacked">Title</ion-label>
                <ion-input
                  v-model="editForm.title"
                  placeholder="Enter book title"
                  required
                />
              </ion-item>

              <ion-item>
                <ion-label position="stacked">Author</ion-label>
                <ion-input
                  v-model="editForm.author"
                  placeholder="Enter author name"
                  required
                />
              </ion-item>

              <ion-item>
                <ion-label position="stacked">Year</ion-label>
                <ion-input
                  type="number"
                  v-model.number="editForm.year"
                  placeholder="e.g. 2020"
                  required
                />
              </ion-item>

              <ion-item>
                <ion-label position="stacked">Category</ion-label>
                <ion-input
                  v-model="editForm.category"
                  placeholder="e.g. Programming, Novel..."
                  required
                />
              </ion-item>

              <ion-item>
                <ion-label position="stacked">Availability</ion-label>
                <ion-select v-model="editForm.isAvailable">
                  <ion-select-option :value="1">Available</ion-select-option>
                  <ion-select-option :value="0">Borrowed</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>

            <div class="buttons">
              <ion-button
                type="submit"
                expand="block"
                :disabled="state.isSaving"
              >
                {{ state.isSaving ? 'Saving...' : 'Save Changes' }}
              </ion-button>

              <ion-button
                expand="block"
                fill="clear"
                color="medium"
                @click="closeEdit"
              >
                Cancel
              </ion-button>
            </div>

            <p v-if="state.editError" class="error">
              {{ state.editError }}
            </p>
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
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption,
  onIonViewWillEnter,
} from '@ionic/vue'

import { reactive } from 'vue'
import { getBooks, deleteBook, updateBook } from '@/services/BookService'

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
      // Refresh list and close modal
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
h2 {
  margin-bottom: 12px;
  font-size: 1.3rem;
  font-weight: 600;
}
ion-item h3 {
  font-size: 1rem;
  font-weight: 600;
}
ion-item p {
  margin: 2px 0;
  font-size: 0.85rem;
}
.buttons {
  margin-top: 16px;
}
.error {
  margin-top: 12px;
  color: red;
  font-size: 0.9rem;
}
</style>
